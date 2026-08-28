import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { OrderWithItems } from "@/actions/orders-action";
import { ORDER_STATUS_STYLES } from "@/lib/order-status";

export default function OrderListCard({ order }: { order: OrderWithItems }) {
  const previewImages = order.items
    .slice(0, 3)
    .map((item) => item.variant.product.images[0])
    .filter(Boolean);

  return (
    <Link
      href={`/orders/${order.id}`}
      className="block border shadow-xl hover:shadow-primary/50 hover:-translate-1 active:scale-95 duration-300 transition-all">
      <div className="flex justify-between items-center p-4 border-b bg-linear-30 from-secondary/70 to-secondary/50">
        <div>
          <p className="font-medium uppercase text-primary">
            Order #{order.id.slice(0, 8)}
          </p>
          <p className="text-xs text-neutral">
            {order.createdAt.toLocaleDateString("en-EG", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <Badge variant="outline" className={ORDER_STATUS_STYLES[order.status]}>
          {order.status}
        </Badge>
      </div>

      <div className="flex items-center gap-4 p-4">
        <div className="flex -space-x-3">
          {previewImages.map((src, i) => (
            <div
              key={i}
              className="relative w-12 h-12 rounded-full border-2 border-background overflow-hidden">
              <Image src={src!} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
        <p className="text-sm text-neutral flex-1">
          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
        </p>
        <p className="font-semibold text-primary">EGP {order.amount}</p>
      </div>
    </Link>
  );
}
