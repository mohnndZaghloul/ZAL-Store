import { routes } from "@/lib/centralized-routes";
import {
  BookOpen,
  Bot,
  BoxIcon,
  CircleUserRound,
  LayoutDashboard,
  ListOrderedIcon,
  MonitorCog,
  Settings2,
  Shirt,
  SquareTerminal,
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
];

export const systemLinks = [
  {
    title: "Settings",
    url: "#",
    icon: Settings2,
    items: [
      {
        title: "Categories",
        url: "/dashboard/system/categories",
      },
      {
        title: "Discount",
        url: "/dashboard/system/discount",
      },
    ],
  },
];
