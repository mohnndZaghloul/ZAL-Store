import { notFound } from "next/navigation";
import Image from "next/image";
import { getUserOrderById } from "@/actions/orders-action";
import OrderStatusStepper from "@/components/shop/OrderStatusStepper";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getUserOrderById(orderId);

  if (!order) {
    notFound();
  }

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0,
  );

  return (
    <main className="container py-10 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-primary uppercase">
          Order #{order.id.slice(0, 8)}
        </h1>
        <p className="text-sm text-neutral">
          Placed on{" "}
          {order.createdAt.toLocaleDateString("en-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="border p-6">
        <OrderStatusStepper status={order.status} />
      </div>

      <div className="border divide-y">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-4 p-4">
            <div className="relative w-16 h-16 shrink-0">
              <Image
                src={item.variant.product.images[0] ?? ""}
                alt={item.variant.product.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {item.variant.product.title}
              </p>
              <p className="text-xs text-neutral">
                {item.variant.size} / {item.variant.color} × {item.quantity}
              </p>
            </div>
            <p className="text-sm font-medium text-nowrap">
              EGP {(item.priceAtPurchase * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-4 space-y-1">
          <h2 className="text-sm font-semibold text-primary uppercase">
            Shipping
          </h2>
          <p className="text-sm">{order.customerName}</p>
          <p className="text-sm text-neutral">{order.customerPhone}</p>
          <p className="text-sm text-neutral">
            {order.address}, {order.city}
          </p>
        </div>

        <div className="border p-4 space-y-1">
          <h2 className="text-sm font-semibold text-primary uppercase">
            Payment
          </h2>
          <p className="text-sm">
            {order.paymentMethod === "CASH" ? "Cash on Delivery" : "InstaPay"}
          </p>
        </div>
      </div>

      <div className="border p-4 space-y-2">
        <div className="flex justify-between text-sm text-neutral">
          <span>Subtotal</span>
          <span>EGP {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-neutral">
          <span>Shipping</span>
          <span>EGP {order.shippingFee.toFixed(2)}</span>
        </div>
        {order.discountAmount > 0 && (
          <div className="flex justify-between text-sm text-emerald-700">
            <span>Discount</span>
            <span>- EGP {order.discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-primary pt-2 border-t">
          <span>Total</span>
          <span>EGP {order.amount.toFixed(2)}</span>
        </div>
      </div>
    </main>
  );
}
