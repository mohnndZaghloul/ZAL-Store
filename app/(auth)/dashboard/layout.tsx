import { getCurrentUser } from "@/actions/customers-actions";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

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
