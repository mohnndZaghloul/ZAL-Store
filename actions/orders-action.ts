"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/actions/customers-actions";
import { checkoutSchema } from "@/lib/validation";
import { resolveCheckoutData } from "@/lib/checkout";
import { OrderStatus, Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { getShippingFee } from "@/lib/shipping";
import { validateDiscountCode } from "./discount-action";
import {
  sendOrderConfirmationEmail,
  sendOrderShippedEmail,
} from "@/lib/email";

export type OrderActionState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
  orderId?: string;
};

export async function createOrder(
  variantId: string | undefined,
  quantity: string | undefined,
  formData: FormData,
): Promise<OrderActionState> {
  const user = await getCurrentUser(); 

  const parsed = checkoutSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    city: formData.get("city"),
    paymentMethod: formData.get("paymentMethod"),
    discountCode: formData.get("discountCode") || undefined,
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

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
          customerEmail: parsed.data.email,
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
    console.error("createOrder failed:", err); 
    return { message: "Something went wrong placing your order." };
  }

  await sendOrderConfirmationEmail({
    email: parsed.data.email,
    customerName: parsed.data.name,
    orderId,
    subtotal: checkoutData.subtotal,
    shippingFee,
    discountAmount,
    address: parsed.data.address,
    city: parsed.data.city,
    phone: parsed.data.phone,
    paymentMethod: parsed.data.paymentMethod,
    amount:
      Math.round(checkoutData.subtotal) +
      shippingFee -
      discountAmount,
  });

  return {
    success: true,
    orderId,
  };
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
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    
    if (status === OrderStatus.SHIPPED && order.customerEmail) {
      await sendOrderShippedEmail({
        email: order.customerEmail,
        customerName: order.customerName,
        orderId: order.id,
      });
    }

    revalidatePath("/dashboard/orders");

    return { success: true as const };
  } catch (error) {
    console.error("updateOrderStatus failed:", error);

    return {
      success: false as const,
      message: "Failed to update order status.",
    };
  }
}

export async function getUserOrders(): Promise<OrderWithItems[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  return prisma.order.findMany({
    where: { userId: user.id },
    include: orderWithItems.include,
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserOrderById(
  orderId: string,
): Promise<OrderWithItems | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: orderWithItems.include,
  });


  if (!order || order.userId !== user.id) return null;

  return order;
}