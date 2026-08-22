"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/customers-actions";
import { checkoutSchema } from "@/lib/validation";
import { resolveCheckoutData } from "@/lib/checkout";

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
  if (!user) {
    return { message: "Please sign in to place your order." };
  }

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
          userId: user.id,
          amount: Math.round(checkoutData.subtotal),
          currency: "EGP",
          status: "PENDING",
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
    console.error("CREATE ORDER ERROR:", err);

    if (err instanceof Error) {
      console.error("MESSAGE:", err.message);
      console.error("STACK:", err.stack);
    }

    const msg = err instanceof Error ? err.message : "";

    if (msg.startsWith("OUT_OF_STOCK:")) {
      return {
        message: `Sorry, "${msg.split(":")[1]}" just sold out.`,
      };
    }

    return {
      message: msg || "Something went wrong placing your order.",
    };
  }

  redirect(`/orders/${orderId}/confirmation`);
}
