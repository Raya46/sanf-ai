"use client"

import { Pie, PieChart, Cell } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { name: "Identity Risk", value: 15, fill: "var(--chart-1)" },
  { name: "Document Forgery Risk", value: 10, fill: "var(--chart-2)" },
  { name: "Device/Environment Risk", value: 20, fill: "var(--chart-3)" },
  { name: "Behavioral Anomaly Risk", value: 25, fill: "var(--chart-4)" },
  { name: "Application Pattern Risk", value: 18, fill: "var(--chart-5)" },
  { name: "Financial Mismatch Risk", value: 12, fill: "hsl(var(--chart-6))" },
  { name: "Historical Blacklist", value: 5, fill: "hsl(var(--chart-7))" },
]

const chartConfig = {
  risk: {
    label: "Risk",
  },
  "Identity Risk": {
    label: "Identity Risk",
    color: "var(--chart-1)",
  },
  "Document Forgery Risk": {
    label: "Document Forgery Risk",
    color: "var(--chart-2)",
  },
  "Device/Environment Risk": {
    label: "Device/Environment Risk",
    color: "var(--chart-3)",
  },
  "Behavioral Anomaly Risk": {
    label: "Behavioral Anomaly Risk",
    color: "var(--chart-4)",
  },
  "Application Pattern Risk": {
    label: "Application Pattern Risk",
    color: "var(--chart-5)",
  },
  "Financial Mismatch Risk": {
    label: "Financial Mismatch Risk",
    color: "hsl(var(--chart-6))",
  },
  "Historical Blacklist": {
    label: "Historical Blacklist",
    color: "hsl(var(--chart-7))",
  },
} satisfies ChartConfig

export function FraudDonutChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Fraud Assessment</CardTitle>
        <CardDescription>Breakdown of potential fraud risks</CardDescription>
      </CardHeader>
      <CardContent className="flex- pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="name" />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              strokeWidth={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="flex-wrap gap-1 text-[0.625rem]"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}