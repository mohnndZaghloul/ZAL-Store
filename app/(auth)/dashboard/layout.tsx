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
        <SidebarTrigger
          size="icon-lg"
          className="sticky top-16 z-50 bg-primary text-primary-foreground"
        />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
