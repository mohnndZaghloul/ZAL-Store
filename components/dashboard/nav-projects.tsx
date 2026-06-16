"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { JSX } from "react";
import { Role } from "./SidebarData";
import { usePathname } from "next/navigation";

export function NavProjects({
  projects,
}: {
  projects: {
    label: string;
    url: string;
    icon?: JSX.Element;
    roles: Role[];
  }[];
}) {
  const { isMobile } = useSidebar();
  const path = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton
              className={`${path?.split("/")[2] === item?.url?.split("/")[2] ? "text-primary hover:text-primary" : "none"}`}
              render={<Link href={item.url} />}>
              {item.icon}
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
