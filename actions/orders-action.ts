"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/customers-actions";
import { checkoutSchema } from "@/lib/validation";
import { resolveCheckoutData } from "@/lib/checkout";
import { OrderStatus, Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";

export type OrderActionState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createOrder(
  variantId: string | undefined,
  quantity: string | undefined,
  formData: FormData,
): Promise<OrderActionState> {
  const user = await getCurrentUser();
  // if (!user) {
  //   return { message: "Please sign in to place your order." };
  // }

  const parsed = checkoutSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    city: formData.get("city"),
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

  let orderId: string;
  try {
    orderId = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: user?.id,
          amount: Math.round(checkoutData.subtotal),
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

      return order.id;
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.startsWith("OUT_OF_STOCK:")) {
      return { message: `Sorry, "${msg.split(":")[1]}" just sold out.` };
    }
    console.error("createOrder failed:", err);
    return { message: "Something went wrong placing your order." };
  }

  redirect(`/orders/${orderId}`);
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
