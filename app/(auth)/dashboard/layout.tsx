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


  const isSuperAdmin =
    user.email?.toLowerCase() === "zaaaal.eg@gmail.com";

  return (
    <SidebarProvider>
      <DashboardSidebar isSuperAdmin={isSuperAdmin} />
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
