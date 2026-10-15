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
  sendAdminNewOrderEmail,
} from "@/lib/email";
import { cookies } from "next/headers";

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


  // Record successful order creation without affecting the order itself.
  const checkoutIdValue = formData.get("checkoutId");

  if (
    typeof checkoutIdValue === "string" &&
    /^[0-9a-f-]{36}$/i.test(checkoutIdValue)
  ) {
    try {
      const startedEvent = await prisma.analyticsEvent.findFirst({
        where: {
          eventType: "CHECKOUT_STARTED",
          checkoutId: checkoutIdValue,
        },
        select: { visitorId: true },
      });

      const cookieStore = await cookies();
      const cookieVisitorId = cookieStore.get("zal_visitor_id")?.value;

      const visitorId =
        startedEvent?.visitorId ??
        (cookieVisitorId &&
        /^[0-9a-f-]{36}$/i.test(cookieVisitorId)
          ? cookieVisitorId
          : null);

      if (visitorId) {
        await prisma.analyticsEvent.create({
          data: {
            visitorId,
            eventType: "ORDER_CREATED",
            checkoutId: checkoutIdValue,
            orderId,
            path: "/checkout",
          },
        });
      } else {
        console.warn(
          "Order created, but no visitor ID was available for analytics.",
        );
      }
    } catch (analyticsError) {
      console.error(
        "Failed to record completed checkout:",
        analyticsError,
      );
    }
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

  try {
    const adminEmailResult = await sendAdminNewOrderEmail({
      orderId,
      customerName: parsed.data.name,
      customerEmail: parsed.data.email,
      amount:
        Math.round(checkoutData.subtotal) +
        shippingFee -
        discountAmount,
      paymentMethod: parsed.data.paymentMethod,
    });

    if (!adminEmailResult.success) {
      console.error(
        "Order was created, but the admin notification email failed.",
      );
    }
  } catch (error) {
    console.error("Failed to send admin order notification:", error);
  }

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
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }

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


export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    return {
      success: false as const,
      message: "Unauthorized: Admin access required.",
    };
  }

  const allowedStatuses = Object.values(OrderStatus);

  if (!allowedStatuses.includes(status)) {
    return {
      success: false as const,
      message: "Invalid order status.",
    };
  }

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



export async function getDashboardStats() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }

  const now = new Date();
  const currentPeriodStart = new Date(now);
  currentPeriodStart.setDate(currentPeriodStart.getDate() - 30);

  const previousPeriodStart = new Date(currentPeriodStart);
  previousPeriodStart.setDate(previousPeriodStart.getDate() - 30);

  const validOrders = {
    status: { not: OrderStatus.CANCELLED },
  };

  const [
    totalRevenueResult,
    totalOrders,
    newCustomers,
    currentPeriodRevenueResult,
    previousPeriodRevenueResult,
    customerOrders,
    registeredUsers,
    pageViewEvents,
    checkoutEvents,

  ] = await Promise.all([
    prisma.order.aggregate({
      where: validOrders,
      _sum: { amount: true },
    }),

    prisma.order.count({
      where: validOrders,
    }),

    prisma.user.count({
      where: {
        role: "USER",
        createdAt: { gte: currentPeriodStart, lte: now },
      },
    }),

    prisma.order.aggregate({
      where: {
        ...validOrders,
        createdAt: { gte: currentPeriodStart, lte: now },
      },
      _sum: { amount: true },
    }),

    prisma.order.aggregate({
      where: {
        ...validOrders,
        createdAt: {
          gte: previousPeriodStart,
          lt: currentPeriodStart,
        },
      },
      _sum: { amount: true },
    }),

    prisma.order.findMany({
      where: validOrders,
      select: {
        id: true,
        userId: true,
        customerEmail: true,
      },
    }),

    prisma.user.findMany({
      where: { role: "USER" },
      select: {
        id: true,
        email: true,
      },
    }),
    prisma.analyticsEvent.findMany({
      where: { eventType: "PAGE_VIEW" },
      select: { visitorId: true },
    }),

    prisma.analyticsEvent.findMany({
      where: { eventType: "CHECKOUT_STARTED" },
      select: { visitorId: true },
    }),

  ]);

  const currentRevenue = Number(
    currentPeriodRevenueResult._sum.amount ?? 0,
  );

  const previousRevenue = Number(
    previousPeriodRevenueResult._sum.amount ?? 0,
  );

  const growthRate =
    previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : null;

  // Match guest orders to registered accounts by email.
  const userIdByEmail = new Map<string, string>();

  for (const registeredUser of registeredUsers) {
    const email = registeredUser.email.trim().toLowerCase();

    if (email) {
      userIdByEmail.set(email, registeredUser.id);
    }
  }

  // Count non-cancelled orders for each identifiable customer.
  const ordersPerCustomer = new Map<string, number>();

  for (const order of customerOrders) {
    const email = order.customerEmail?.trim().toLowerCase();

    const customerKey = order.userId
      ? `user:${order.userId}`
      : email
        ? `user:${userIdByEmail.get(email) ?? `email:${email}`}`
        : `order:${order.id}`;

    ordersPerCustomer.set(
      customerKey,
      (ordersPerCustomer.get(customerKey) ?? 0) + 1,
    );
  }

  const totalCustomersWithOrders = ordersPerCustomer.size;

  const returningCustomers = Array.from(
    ordersPerCustomer.values(),
  ).filter((orderCount) => orderCount >= 2).length;

  const repeatPurchaseRate =
    totalCustomersWithOrders > 0
      ? (returningCustomers / totalCustomersWithOrders) * 100
      : 0;

      const uniqueWebsiteVisitors = new Set(
        pageViewEvents.map((event) => event.visitorId),
      ).size;

      const checkoutVisitors = new Set(
        checkoutEvents.map((event) => event.visitorId),
      ).size;

  return {
    totalRevenue: Number(totalRevenueResult._sum.amount ?? 0),
    totalOrders,
    newCustomers,
    growthRate,
    returningCustomers,
    repeatPurchaseRate,
    uniqueWebsiteVisitors,
    checkoutVisitors,
  };
}


export async function getDashboardRevenueChart() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }

  const today = new Date();
  const endDate = new Date(
    Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate() + 1,
    ),
  );

  const startDate = new Date(endDate);
  startDate.setUTCDate(startDate.getUTCDate() - 90);

  const orders = await prisma.order.findMany({
    where: {
      status: { not: OrderStatus.CANCELLED },
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },
    select: {
      createdAt: true,
      amount: true,
    },
  });

  const revenueByDate = new Map<string, number>();

  for (const order of orders) {
    const date = order.createdAt.toISOString().slice(0, 10);

    revenueByDate.set(
      date,
      (revenueByDate.get(date) ?? 0) + Number(order.amount),
    );
  }

  const chartData: { date: string; revenue: number }[] = [];

  for (let i = 0; i < 90; i++) {
    const date = new Date(startDate);
    date.setUTCDate(date.getUTCDate() + i);

    const dateKey = date.toISOString().slice(0, 10);

    chartData.push({
      date: dateKey,
      revenue: revenueByDate.get(dateKey) ?? 0,
    });
  }

  return chartData;
}