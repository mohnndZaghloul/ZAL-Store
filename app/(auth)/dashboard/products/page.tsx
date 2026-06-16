import { ProductsColumns } from "@/components/dashboard/tables/TabelsColumns";
import { DataTable } from "@/components/dashboard/tables/data-table";
import { Box, CirclePlusIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Owner products | Next Store",
  description: "page contain products in user store which created by him",
  keywords: ["products", "owner", "dashboard"],
};

export default async function ProductsPage() {
  return (
    <main className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl uppercase font-bold mb-4 flex items-center gap-2">
          <Box />
          your products
        </h1>
        <Button
          className="capitalize"
          nativeButton={false}
          render={
            <Link href="./products/add-product">
              <CirclePlusIcon />
              add new product
            </Link>
          }
        />
      </div>
      <DataTable columns={ProductsColumns} data={[]} filter="title" />
    </main>
  );
}
