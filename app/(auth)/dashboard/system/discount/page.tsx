import { getAllDiscountCodes } from "@/actions/discount-action";
import DiscountForm from "@/components/dashboard/DiscountForm";
import { DataTable } from "@/components/dashboard/tables/data-table";
import { DiscountColumns } from "@/components/dashboard/tables/DiscountColumns";
import { Ticket } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discount Codes | Next Store",
  description: "manage discount codes",
  keywords: ["discounts", "coupons", "dashboard"],
};

export default async function DiscountsDashboard() {
  const data = await getAllDiscountCodes();

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-xl md:text-2xl uppercase font-bold flex items-center gap-2">
        <Ticket />
        discount codes
      </h1>

      <DiscountForm />

      <DataTable columns={DiscountColumns} data={data} filter="code" />
    </main>
  );
}
