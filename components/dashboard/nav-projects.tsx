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

type ProjectLink = {
  label: string;
  url: string;
  icon?: JSX.Element;
  roles: Role[];
  superAdminOnly?: boolean;
};

export function NavProjects({
  projects,
  isSuperAdmin,
}: {
  projects: ProjectLink[];
  isSuperAdmin: boolean;
}) {
  const { isMobile } = useSidebar();
  const path = usePathname();

  const visibleProjects = projects.filter((item) => {
    if (item.superAdminOnly && !isSuperAdmin) {
      return false;
    }

    return true;
  });

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Platform</SidebarGroupLabel>

      <SidebarMenu>
        {visibleProjects.map((item) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton
              className={`${
                path?.split("/")[2] === item?.url?.split("/")[2]
                  ? "text-primary hover:text-primary"
                  : "none"
              }`}
              render={<Link href={item.url} />}
            >
              {item.icon}
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
