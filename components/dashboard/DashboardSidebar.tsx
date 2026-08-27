"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Shirt } from "lucide-react";
import { NavProjects } from "./nav-projects";
import { sidebarLinks, systemLinks } from "./SidebarData";
import { NavMain } from "./nav-main";

export function DashboardSidebar() {
  return (
    <Sidebar collapsible="icon" className="z-50">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-8 items-center justify-center bg-primary text-sidebar-primary-foreground">
                <Shirt className="size-10" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <h4 className="text-xl text-primary">ZAL</h4>
                <span className="text-xs">store</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={sidebarLinks} />
        <NavMain items={systemLinks} />
      </SidebarContent>
    </Sidebar>
  );
}
