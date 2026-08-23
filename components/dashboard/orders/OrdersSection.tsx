import OrderCard from "./OrderCard";
import { Orders_TP } from "@/types";

export default function OrdersSection({ orders }: { orders: Orders_TP[] }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
      {orders?.map((order) => (
        <OrderCard key={order?.id} order={order} />
      ))}
    </section>
  );
}
