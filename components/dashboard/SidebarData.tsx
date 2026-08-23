import { routes } from "@/lib/centralized-routes";
import {
  BoxIcon,
  CircleUserRound,
  LayoutDashboard,
  ListOrderedIcon,
  MonitorCog,
  Shirt,
  User2,
} from "lucide-react";
import { JSX } from "react";

export type Role = "ADMIN" | "USER";

type SidebarLink = {
  label: string;
  url: string;
  icon?: JSX.Element;
  roles: Role[];
};

export const sidebarLinks: SidebarLink[] = [
  // {
  //   label: "Profile",
  //   url: "/dashboard/profile",
  //   icon: <CircleUserRound />,
  //   roles: ["ADMIN", "USER"],
  // },
  {
    label: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboard />,
    roles: ["ADMIN", "USER"],
  },
  {
    label: "Products",
    url: "/dashboard/products",
    icon: <Shirt />,
    roles: ["ADMIN", "USER"],
  },
  {
    label: "My Orders",
    url: "/dashboard/orders",
    icon: <BoxIcon />,
    roles: ["ADMIN"],
  },
  // {
  //   label: "Customers",
  //   url: routes.customers,
  //   icon: <User2 />,
  //   roles: ["ADMIN"],
  // },
  {
    label: "System",
    url: routes.system,
    icon: <MonitorCog />,
    roles: ["ADMIN"],
  },
];
