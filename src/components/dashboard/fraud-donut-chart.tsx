"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, LabelList } from "recharts"

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { name: "Risiko Identitas", value: 15, fill: "var(--chart-1)" },
  { name: "Pemalsuan Dokumen", value: 10, fill: "var(--chart-2)" },
  { name: "Risiko Perangkat/Lingkungan", value: 20, fill: "var(--chart-3)" },
  { name: "Risiko Anomali Perilaku", value: 25, fill: "var(--chart-4)" },
  { name: "Risiko Pola Aplikasi", value: 18, fill: "var(--chart-5)" },
  { name: "Ketidaksesuaian Finansial", value: 12, fill: "hsl(var(--chart-6))" },
  { name: "Blacklist", value: 5, fill: "hsl(var(--chart-7))" },
]

const chartConfig = {
  value: {
    label: "Value",
  },
  label: {
    color: "hsl(var(--background))",
  },
  "Risiko Identitas": {
    label: "Risiko Identitas",
  },
  "Risiko Pemalsuan Dokumen": {
    label: "Risiko Pemalsuan Dokumen",
  },
  "Risiko Perangkat/Lingkungan": {
    label: "Risiko Perangkat/Lingkungan",
  },
  "Risiko Anomali Perilaku": {
    label: "Risiko Anomali Perilaku",
  },
  "Risiko Pola Aplikasi": {
    label: "Risiko Pola Aplikasi",
  },
  "Ketidaksesuaian Finansial": {
    label: "Ketidaksesuaian Finansial",
  },
  "Blacklist Historis": {
    label: "Blacklist Historis",
  },
} satisfies ChartConfig

export function FraudDonutChart() {
  const sortedChartData = [...chartData].sort((a, b) => b.value - a.value);

  const minVal = sortedChartData[sortedChartData.length - 1].value;
  const maxVal = sortedChartData[0].value;
  const valueRange = maxVal - minVal;

  const gradientChartData = sortedChartData.map((item) => {
    const normalizedValue = valueRange === 0 ? 0.5 : (item.value - minVal) / valueRange;
    // Map normalized value to a lightness range (e.g., 30% to 70%)
    // Highest value (normalized 1) gets darkest (30%)
    // Lowest value (normalized 0) gets lightest (70%)
    const lightness = 70 - (normalizedValue * 40);

    // Assuming --color-sanf-primary is defined as HSL components in CSS variables
    // This is a placeholder. Ideally, these would come from the actual --color-sanf-primary definition.
    // For now, using a generic blue HSL.
    const hue = 220; // Example hue for blue
    const saturation = 80; // Example saturation

    const fill = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    return { ...item, fill };
  });

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Penilaian Risiko Fraud</CardTitle>
        <CardDescription>Rincian potensi risiko fraud</CardDescription>
      </CardHeader>
      <CardContent className="flex- pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square"
        >
          <BarChart
            accessibilityLayer
            data={gradientChartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="value" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="name" />}
            />
            <Bar dataKey="value" radius={8} layout="vertical" fill="dataKey('fill')">
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-white"
                fontSize={12}
              />
              <LabelList
                dataKey="value"
                position="right"
                offset={8}
                className="fill-white"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}