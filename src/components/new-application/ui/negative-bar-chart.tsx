"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RevenueData } from "@/lib/types";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

type Period = "monthly" | "quarterly" | "annually";

interface ChartBarNegativeProps {
  data: RevenueData[];
}

const chartConfig = {
  revenue: {
    label: "Revenue",
  },
} satisfies ChartConfig;

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Helper to format currency
const formatCurrency = (value: number) => {
  if (Math.abs(value) >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
};

export function ChartBarNegative({ data }: ChartBarNegativeProps) {
  const [period, setPeriod] = useState<Period>("annually");

  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const sortedData = [...data].sort(
      (a, b) => a.year - b.year || a.month - b.month
    );

    if (period === "monthly") {
      return sortedData.map((item) => ({
        name: `${MONTH_NAMES[item.month - 1]} '${String(item.year).slice(-2)}`,
        revenue: item.revenue,
      }));
    }

    const groupedData: { [key: string]: number } = {};

    sortedData.forEach((item) => {
      let key = "";
      if (period === "annually") {
        key = String(item.year);
      } else {
        // quarterly
        const quarter = `Q${Math.ceil(item.month / 3)}`;
        key = `${quarter} ${item.year}`;
      }
      if (!groupedData[key]) {
        groupedData[key] = 0;
      }
      groupedData[key] += item.revenue;
    });

    return Object.entries(groupedData).map(([name, revenue]) => ({
      name,
      revenue,
    }));
  }, [data, period]);

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Analysis</CardTitle>
          <CardDescription>
            No revenue data available to display.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <p>Awaiting data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Revenue Analysis</CardTitle>
            <CardDescription>AI-generated revenue analysis</CardDescription>
          </div>
          <Tabs
            value={period}
            onValueChange={(value) => setPeriod(value as Period)}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="annually">Annually</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={processedData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tickLine={false}
              axisLine={false}
              width={50}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(Number(value))
                  }
                  hideLabel
                />
              }
            />
            <Bar dataKey="revenue">
              {processedData.map((item) => (
                <Cell
                  key={item.name}
                  fill={
                    item.revenue >= 0
                      ? "hsl(210 90% 40%)" // A shade of blue
                      : "hsl(210 90% 30%)" // A darker shade of blue for negative
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
