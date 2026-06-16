"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { XIcon, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";

export default function SidebarCart() {
  const { setOpen } = useSidebar();

  return (
    <Sidebar side="right">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-between items-center border-b p-4">
            <div className="flex gap-4">
              <ShoppingCart />
              <h3 className="font-light text-2xl">Cart</h3>
            </div>
            <Button
              size="icon-lg"
              variant="ghost"
              onClick={() => setOpen(false)}>
              <XIcon className="h-5! w-5!" />
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
