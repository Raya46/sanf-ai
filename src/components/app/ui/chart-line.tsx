"use client";

import { CartesianGrid, Dot, Line, LineChart } from "recharts";

import { CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A line chart with dots and colors";

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
    color: "#03045E",
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

export function ChartLineDotsColors() {
  return (
    <CardContent className="flex-1 pb-0">
      <ChartContainer config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 24,
            left: 24,
            right: 24,
          }}
        >
          <CartesianGrid vertical={false} />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="line"
                nameKey="visitors"
                hideLabel
              />
            }
          />
          <Line
            dataKey="visitors"
            type="natural"
            stroke="var(--color-visitors)"
            strokeWidth={2}
            dot={({ payload, ...props }) => {
              return (
                <Dot
                  key={payload.browser}
                  r={5}
                  cx={props.cx}
                  cy={props.cy}
                  fill={payload.fill}
                  stroke={payload.fill}
                />
              );
            }}
          />
        </LineChart>
      </ChartContainer>
    </CardContent>
  );
}
