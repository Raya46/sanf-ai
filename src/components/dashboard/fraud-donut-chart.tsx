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
  { name: "Risiko Identitas", value: 15, fill: "var(--chart-1)" },
  { name: "Risiko Pemalsuan Dokumen", value: 10, fill: "var(--chart-2)" },
  { name: "Risiko Perangkat/Lingkungan", value: 20, fill: "var(--chart-3)" },
  { name: "Risiko Anomali Perilaku", value: 25, fill: "var(--chart-4)" },
  { name: "Risiko Pola Aplikasi", value: 18, fill: "var(--chart-5)" },
  { name: "Risiko Ketidaksesuaian Finansial", value: 12, fill: "hsl(var(--chart-6))" },
  { name: "Daftar Hitam Historis", value: 5, fill: "hsl(var(--chart-7))" },
]

const chartConfig = {
  risk: {
    label: "Risiko",
  },
  "Risiko Identitas": {
    label: "Risiko Identitas",
    color: "var(--chart-1)",
  },
  "Risiko Pemalsuan Dokumen": {
    label: "Risiko Pemalsuan Dokumen",
    color: "var(--chart-2)",
  },
  "Risiko Perangkat/Lingkungan": {
    label: "Risiko Perangkat/Lingkungan",
    color: "var(--chart-3)",
  },
  "Risiko Anomali Perilaku": {
    label: "Risiko Anomali Perilaku",
    color: "var(--chart-4)",
  },
  "Risiko Pola Aplikasi": {
    label: "Risiko Pola Aplikasi",
    color: "var(--chart-5)",
  },
  "Risiko Ketidaksesuaian Finansial": {
    label: "Risiko Ketidaksesuaian Finansial",
    color: "hsl(var(--chart-6))",
  },
  "Daftar Hitam Historis": {
    label: "Daftar Hitam Historis",
    color: "hsl(var(--chart-7))",
  },
} satisfies ChartConfig

export function FraudDonutChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Penilaian Risiko Fraud</CardTitle>
        <CardDescription>Rincian potensi risiko fraud</CardDescription>
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