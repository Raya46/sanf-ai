"use client";

import { Pie, PieChart } from "recharts";

import { CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A donut chart";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "#0077B6" },
  { browser: "safari", visitors: 200, fill: "#ADE8F4" },
  { browser: "firefox", visitors: 187, fill: "#03045E" },
  { browser: "edge", visitors: 173, fill: "#0077B6" },
  { browser: "other", visitors: 90, fill: "#ADE8F4" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "#0077B6",
  },
  safari: {
    label: "Safari",
    color: "#ADE8F4",
  },
  firefox: {
    label: "Firefox",
    color: "#03045E",
  },
  edge: {
    label: "Edge",
    color: "#0077B6",
  },
  other: {
    label: "Other",
    color: "#ADE8F4",
  },
} satisfies ChartConfig;

export function ChartPieDonut() {
  return (
    <CardContent className="flex-1 pb-0">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="visitors"
            nameKey="browser"
            innerRadius={60}
          />
        </PieChart>
      </ChartContainer>
    </CardContent>
  );
}
