
"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon,
  UsersIcon,
  RepeatIcon,
  ShoppingCartIcon,
  WalletIcon,
  ShoppingBagIcon,
} from "lucide-react";
import type { getDashboardStats } from "@/actions/orders-action";

type DashboardStats = Awaited<ReturnType<typeof getDashboardStats>>;

export function SectionCards({ stats }: { stats: DashboardStats }) {
  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-EG", {
      maximumFractionDigits: 2,
    }).format(value);

  const formatMoney = (value: number) =>
    `${formatNumber(value)} EGP`;

  const growth = stats.growthRate;

  const GrowthIcon =
    growth === null
      ? MinusIcon
      : growth >= 0
        ? TrendingUpIcon
        : TrendingDownIcon;

  const growthLabel =
    growth === null
      ? "Not enough data"
      : `${growth > 0 ? "+" : ""}${growth.toFixed(1)}%`;

  const cards = [
    {
      title: "Total Revenue",
      value: formatMoney(stats.totalRevenue),
      badge: "All time",
      description: "Value of non-cancelled orders",
      footer: "Recorded order value",
      Icon: WalletIcon,
    },
    {
      title: "New Customers",
      value: formatNumber(stats.newCustomers),
      badge: "Last 30 days",
      description: "Registered customer accounts",
      footer: "Accounts created in the last 30 days",
      Icon: UsersIcon,
    },
    {
      title: "Total Orders",
      value: formatNumber(stats.totalOrders),
      badge: "All time",
      description: "Non-cancelled orders",
      footer: "Recorded orders excluding cancellations",
      Icon: ShoppingCartIcon,
    },
    {
      title: "Revenue Growth",
      value: growthLabel,
      badge: "Last 30 days",
      description: "Compared with the previous 30 days",
      footer:
        growth === null
          ? "No previous-period revenue to compare"
          : growth >= 0
            ? "Revenue increased or remained steady"
            : "Revenue decreased compared with the previous period",
      Icon: GrowthIcon,
    },
    {
      title: "Returning Customers",
      value: formatNumber(stats.returningCustomers),
      badge: "All time",
      description: "Customers with 2 or more non-cancelled orders",
      footer: "Customers who ordered more than once",
      Icon: RepeatIcon,
    },
    {
      title: "Repeat Purchase Rate",
      value: `${formatNumber(stats.repeatPurchaseRate)}%`,
      badge: "All time",
      description: "Returning customers ÷ customers with orders",
      footer: "Percentage of customers who ordered more than once",
      Icon: TrendingUpIcon,
    },
    {
      title: "Website Visitors",
      value: formatNumber(stats.uniqueWebsiteVisitors),
      badge: "All time",
      description: "Unique visitors who viewed the website",
      footer: "Counted by unique visitor ID",
      Icon: UsersIcon,
    },

    {
      title: "Checkout Visitors",
      value: formatNumber(stats.checkoutVisitors),
      badge: "All time",
      description: "Unique visitors who started checkout",
      footer: "Includes visitors who did not complete an order",
      Icon: ShoppingBagIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {cards.map((card) => {
        const Icon = card.Icon;

        return (
          <Card key={card.title} className="@container/card">
            <CardHeader>
              <CardDescription>{card.title}</CardDescription>

              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {card.value}
              </CardTitle>

              <CardAction>
                <Badge variant="outline">
                  <Icon className="size-4" />
                  {card.badge}
                </Badge>
              </CardAction>
            </CardHeader>

            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.footer}
              </div>

              <div className="text-muted-foreground">
                {card.description}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}