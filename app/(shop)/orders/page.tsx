import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/customers-actions";
import { getUserOrders } from "@/actions/orders-action";
import { PackageSearch } from "lucide-react";
import OrderListCard from "@/components/shop/OrderListCard";

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/orders");
  }

  const orders = await getUserOrders();

  if (orders.length === 0) {
    return (
      <main className="min-h-[50vh] flex flex-col justify-center items-center gap-3 text-center">
        <PackageSearch className="w-10 h-10 text-neutral" />
        <h1 className="text-xl capitalize text-primary">No orders yet</h1>
        <p className="text-sm text-neutral">
          Your placed orders will show up here.
        </p>
      </main>
    );
  }

  return (
    <main className="container py-10 space-y-6">
      <h1 className="text-2xl font-semibold text-primary">Your Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.map((order) => (
          <OrderListCard key={order.id} order={order} />
        ))}
      </div>
    </main>
  );
}
