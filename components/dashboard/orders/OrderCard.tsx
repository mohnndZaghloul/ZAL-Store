"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderWithItems, updateOrderStatus } from "@/actions/orders-action";
import { OrderStatus } from "@/generated/prisma/enums";

const statusVariant: Record<
  OrderStatus,
  "secondary" | "default" | "destructive" | "outline"
> = {
  PENDING: "secondary",
  PROCESSING: "outline",
  SHIPPED: "outline",
  DELIVERED: "default",
  CANCELLED: "destructive",
};

// Reuses the same keys as statusVariant so the dropdown options can never
// drift out of sync with the badge colors above.
const statusOptions = Object.keys(statusVariant) as OrderStatus[];

export default function OrderCard({ order }: { order: OrderWithItems }) {
  const [status, setStatus] = useState(order.status);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (value: OrderStatus | null) => {
    const newStatus = value as OrderStatus;
    const previousStatus = status;
    setStatus(newStatus); // optimistic — updates instantly, no waiting on the server

    startTransition(async () => {
      const result = await updateOrderStatus(order.id, newStatus);
      if (!result.success) {
        setStatus(previousStatus); // revert if the update actually failed
      }
    });
  };

  return (
    <div className="border flex flex-col">
      <div className="flex justify-between items-center text-primary-foreground p-4 border-b bg-linear-180 from-primary to-primary/80">
        <div>
          <p className="font-medium">Order ID : #{order.id.slice(0, 8)}</p>
          <p className="text-xs">
            {order.createdAt.toLocaleDateString("en-EG", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        <Select
          value={status}
          onValueChange={handleStatusChange}
          disabled={isPending}>
          <SelectTrigger className="w-36 bg-transparent border-primary-foreground/40 text-primary-foreground">
            <SelectValue>
              <Badge variant={statusVariant[status]}>{status}</Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="p-4 border-b">
        <p className="text-sm font-medium">{order.customerName}</p>
        <p className="text-xs text-neutral">{order.customerPhone}</p>
      </div>

      <div className="border-b flex-1">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-4 p-4">
            <div className="relative w-14 h-14 shrink-0">
              <Image
                src={item.variant.product.images[0] ?? ""}
                alt={item.variant.product.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm">{item.variant.product.title}</p>
              <p className="text-xs text-neutral">
                {item.variant.size} /{" "}
                <span
                  style={{ background: item.variant.color }}
                  className="rounded-full w-3 aspect-square inline-block"
                />{" "}
                × {item.quantity}
              </p>
            </div>
            <p className="text-sm text-nowrap">
              EGP {(item.priceAtPurchase * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="p-4 flex justify-between items-start gap-4">
        <p className="text-xs text-neutral">
          {order.address}, {order.city}
        </p>
        <p className="font-semibold text-primary text-nowrap">
          EGP {order.amount}
        </p>
      </div>
    </div>
  );
}
