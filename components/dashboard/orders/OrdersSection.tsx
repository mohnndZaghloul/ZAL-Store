import OrderCard from "./OrderCard";
import { Orders_TP } from "@/types";

export default function OrdersSection({ orders }: { orders: Orders_TP[] }) {
  return (
    <section className="container grid grid-cols-1 lg:grid-cols-2 gap-4">
      {orders?.map((order) => (
        <OrderCard key={order?.id} order={order} />
      ))}
    </section>
  );
}
