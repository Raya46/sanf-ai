"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

interface SubMetric {
  name: string;
  value: string;
}

interface ChartDataItem {
  criterion: string;
  score: number;
  fullMark: number;
  subMetrics: SubMetric[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[]; // Recharts payload can be complex, using any for now, can refine if needed
  label?: string;
}

const chartData: ChartDataItem[] = [
  {
    criterion: "Character",
    score: 80,
    fullMark: 100,
    subMetrics: [
      { name: "SLIK score (OJK)", value: "Good" },
      { name: "Overdue % past 12mo", value: "0%" },
      { name: "Number of lenders", value: "2" },
      { name: "Fraud/blacklist flags", value: "None" },
    ],
  },
  {
    criterion: "Capacity",
    score: 90,
    fullMark: 100,
    subMetrics: [
      { name: "Monthly income", value: "Rp 15,000,000" },
      { name: "DSR", value: "30%" },
      { name: "Employment type & stability", value: "Permanent, 5 years" },
    ],
  },
  {
    criterion: "Capital",
    score: 75,
    fullMark: 100,
    subMetrics: [
      { name: "Cash savings", value: "Rp 50,000,000" },
      { name: "Bank balance trends", value: "Stable" },
      { name: "Ownership of high-value assets", value: "Car, House" },
    ],
  },
  {
    criterion: "Conditions",
    score: 85,
    fullMark: 100,
    subMetrics: [
      { name: "Purpose of loan", value: "Productive" },
      { name: "Sector risk", value: "Low" },
      { name: "Macro risk", value: "Low" },
    ],
  },
  {
    criterion: "Collateral",
    score: 70,
    fullMark: 100,
    subMetrics: [
      { name: "Asset type & value", value: "Land, Rp 200,000,000" },
      { name: "Liquidation score", value: "High" },
      { name: "Ownership verification", value: "SHM" },
    ],
  },
]

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--sanf-secondary))",
  },
} satisfies ChartConfig

function CustomChartTooltipContent({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataItem;
    return (
      <div className="rounded-md border bg-white p-2 text-sm shadow-md">
        <p className="font-bold">{label}</p>
        <p className="text-muted-foreground">Score: {data.score}</p>
        {data.subMetrics && data.subMetrics.length > 0 && (
          <div className="mt-2">
            <p className="font-semibold">Contributing Factors:</p>
            {data.subMetrics.map((metric: SubMetric, index: number) => (
              <p key={index} className="text-xs">
                - {metric.name}: {metric.value}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }
  return null;
}

export function CreditRadarChart() {
  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Five C's of Credit Evaluation</CardTitle>
        <CardDescription>
          Assessment based on Character, Capacity, Capital, Conditions, and Collateral
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <ChartTooltip cursor={false} content={<CustomChartTooltipContent />} />
              <PolarGrid />
              <PolarAngleAxis dataKey="criterion" />
              <Radar
                dataKey="score"
                stroke="#5ac4bd"
                fill="#5ac4bd"
                fillOpacity={0.6}
                dot={{
                  r: 4,
                  fillOpacity: 1,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Overall Credit Score: 80 <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}