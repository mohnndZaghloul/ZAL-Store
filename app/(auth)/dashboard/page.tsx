import {
  getDashboardStats,
  getDashboardRevenueChart,
} from "@/actions/orders-action";
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { SectionCards } from "@/components/dashboard/section-cards";

export default async function DashboardPage() {
  const [stats, revenueChart] = await Promise.all([
    getDashboardStats(),
    getDashboardRevenueChart(),
  ]);

  return (
    <main className="container">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards stats={stats} />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive data={revenueChart} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}