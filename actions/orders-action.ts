"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/customers-actions";
import { checkoutSchema } from "@/lib/validation";
import { resolveCheckoutData } from "@/lib/checkout";
import { OrderStatus, Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { getShippingFee } from "@/lib/shipping";
import { validateDiscountCode } from "./discount-action";

export type OrderActionState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createOrder(
  variantId: string | undefined,
  quantity: string | undefined,
  formData: FormData,
): Promise<OrderActionState> {
  const user = await getCurrentUser(); // may be null — guest checkout is allowed

  const parsed = checkoutSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    city: formData.get("city"),
    paymentMethod: formData.get("paymentMethod"),
    discountCode: formData.get("discountCode") || undefined,
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  // Re-resolve from scratch at submit time — price/stock shown on the page
  // a minute ago may no longer be accurate.
  const checkoutData = await resolveCheckoutData(variantId, quantity);
  if (!checkoutData) {
    return { message: "One or more items are no longer available." };
  }

  const shippingFee = getShippingFee(parsed.data.city);

  let discountCodeId: string | undefined;
  let discountAmount = 0;
  if (parsed.data.discountCode) {
    const discountResult = await validateDiscountCode(
      parsed.data.discountCode,
      checkoutData.subtotal,
    );
    if (!discountResult.valid) {
      return { message: discountResult.message };
    }
    discountCodeId = discountResult.discountCodeId;
    discountAmount = discountResult.discountAmount;
  }

  let orderId: string;
  try {
    orderId = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: user?.id,
          amount:
            Math.round(checkoutData.subtotal) + shippingFee - discountAmount,
          shippingFee,
          paymentMethod: parsed.data.paymentMethod,
          discountCodeId,
          discountAmount,
          currency: "EGP",
          customerName: parsed.data.name,
          customerPhone: parsed.data.phone,
          address: parsed.data.address,
          city: parsed.data.city,
          items: {
            create: checkoutData.items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              priceAtPurchase: item.price,
            })),
          },
        },
      });

      for (const item of checkoutData.items) {
        // Atomic check-and-decrement: only succeeds if stock is still
        // enough right now. Guards against a race with another order
        // placed between page load and this transaction.
        const updated = await tx.productVariant.updateMany({
          where: { id: item.variantId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count === 0) {
          throw new Error(`OUT_OF_STOCK:${item.title}`);
        }
      }

      if (checkoutData.mode === "cart") {
        await tx.cartItem.deleteMany({
          where: { id: { in: checkoutData.items.map((i) => i.cartItemId!) } },
        });
      }

      if (discountCodeId) {
        const current = await tx.discountCode.findUnique({
          where: { id: discountCodeId },
          select: { usedCount: true, maxUses: true },
        });
        if (
          !current ||
          (current.maxUses !== null && current.usedCount >= current.maxUses)
        ) {
          throw new Error("DISCOUNT_LIMIT_REACHED");
        }
        await tx.discountCode.update({
          where: { id: discountCodeId },
          data: { usedCount: { increment: 1 } },
        });
      }

      return order.id;
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.startsWith("OUT_OF_STOCK:")) {
      return { message: `Sorry, "${msg.split(":")[1]}" just sold out.` };
    }
    if (msg === "DISCOUNT_LIMIT_REACHED") {
      return { message: "This discount code just reached its usage limit." };
    }
    console.error("createOrder failed:", err); // <- check your terminal for this
    return { message: "Something went wrong placing your order." };
  }

  redirect(`/orders/${orderId}/confirmation`);
}
const orderWithItems = {
  include: {
    items: {
      include: {
        variant: {
          include: { product: true },
        },
      },
    },
  },
};

export type OrderWithItems = Prisma.OrderGetPayload<typeof orderWithItems>;

export async function getAllOrders(): Promise<OrderWithItems[]> {
  try {
    return await prisma.order.findMany({
      include: orderWithItems.include,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("getAllOrders failed:", error);
    throw new Error("Failed to load orders.");
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    revalidatePath("/dashboard/orders"); // adjust to your actual orders page route
    return { success: true as const };
  } catch (error) {
    console.error("updateOrderStatus failed:", error);
    return {
      success: false as const,
      message: "Failed to update order status.",
    };
  }
}
