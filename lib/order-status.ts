import { OrderStatus } from "@/generated/prisma/enums";

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-300",
  PROCESSING: "bg-blue-100 text-blue-800 border-blue-300",
  SHIPPED: "bg-violet-100 text-violet-800 border-violet-300",
  DELIVERED: "bg-emerald-100 text-emerald-800 border-emerald-300",
  CANCELLED: "bg-red-100 text-red-800 border-red-300",
};

export const ORDER_STATUS_STEPS: { status: OrderStatus; label: string }[] = [
  { status: "PENDING", label: "Order Placed" },
  { status: "PROCESSING", label: "Processing" },
  { status: "SHIPPED", label: "Shipped" },
  { status: "DELIVERED", label: "Delivered" },
];
