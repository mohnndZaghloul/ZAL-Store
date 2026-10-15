import { getAllUsers } from "@/actions/customers-actions";
import { CustomersColumns } from "@/components/dashboard/tables/TabelsColumns";
import { DataTable } from "@/components/dashboard/tables/data-table";

export default async function CustomersPage() {
  const users = await getAllUsers();

  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-muted-foreground">
          Manage customers and their access roles.
        </p>
      </div>

      <DataTable
        columns={CustomersColumns}
        data={users}
        filter="name"
      />
    </main>
  );
}