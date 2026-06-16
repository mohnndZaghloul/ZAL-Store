import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <SidebarTrigger size="icon-lg" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
