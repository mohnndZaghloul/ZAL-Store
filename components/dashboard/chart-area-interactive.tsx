
"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

type RevenueChartData = {
  date: string;
  revenue: number;
};

type Props = {
  data: RevenueChartData[];
};

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({ data }: Props) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");
  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = React.useMemo(() => {
    const days =
      timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;

    return data.slice(-days);
  }, [data, timeRange]);

  const formatMoney = (value: number) =>
    `${new Intl.NumberFormat("en-EG", {
      maximumFractionDigits: 2,
    }).format(value)} EGP`;

  const totalRevenue = filteredData.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Revenue Over Time</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Recorded order value for the selected period
          </span>
          <span className="@[540px]/card:hidden">
            Revenue for selected period
          </span>
          <span className="mt-2 block text-lg font-semibold text-foreground">
            {formatMoney(totalRevenue)}
          </span>
        </CardDescription>

        <CardAction>
        <ToggleGroup
  value={[timeRange]}
  onValueChange={(value) => {
    if (value.length > 0) {
      setTimeRange(value[0]);
    }
  }}
  variant="outline"
  className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
>
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>

          <Select
            value={timeRange}
            onValueChange={(value) => {
              if (value !== null) setTimeRange(value);
            }}
          >
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select revenue time range"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient
                id="fillRevenue"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(`${value}T12:00:00Z`).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    timeZone: "UTC",
                  },
                )
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(`${value}T12:00:00Z`).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        timeZone: "UTC",
                      },
                    )
                  }
                  formatter={(value) => formatMoney(Number(value))}
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="revenue"
              type="monotone"
              fill="url(#fillRevenue)"
              stroke="var(--color-revenue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}