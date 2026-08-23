import { getAllOrders } from "@/actions/orders-action";
import OrdersSection from "@/components/dashboard/orders/OrdersSection";
import { Box } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Owner products | Next Store",
  description: "page contain products in user store which created by him",
  keywords: ["products", "owner", "dashboard"],
};

export default async function OrdersDashboard() {
  const data = await getAllOrders();

  return (
    <main className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl uppercase font-bold mb-4 flex items-center gap-2">
          <Box />
          orders
        </h1>
      </div>
      {data.length !== 0 ? (
        <OrdersSection orders={data} />
      ) : (
        <p>there is no order yet</p>
      )}
    </main>
  );
}
