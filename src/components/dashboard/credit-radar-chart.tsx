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
  grade: string;
  subMetrics: SubMetric[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const chartData: ChartDataItem[] = [
  {
    criterion: "Karakter",
    score: 95,
    fullMark: 100,
    grade: "A",
    subMetrics: [
      { name: "Track record baik", value: "✓" },
      { name: "Kolektibilitas lancar", value: "✓" },
      { name: "Manajemen profesional", value: "✓" },
    ],
  },
  {
    criterion: "Kapasitas",
    score: 90,
    fullMark: 100,
    grade: "A",
    subMetrics: [
      { name: "DSCR", value: "2.1x" },
      { name: "ICR", value: "5.79x" },
      { name: "Cash flow positif", value: "✓" },
    ],
  },
  {
    criterion: "Modal",
    score: 85,
    fullMark: 100,
    grade: "B+",
    subMetrics: [
      { name: "DER", value: "0.90" },
      { name: "Modal sendiri", value: "33.3%" },
      { name: "Struktur modal kuat", value: "✓" },
    ],
  },
  {
    criterion: "Jaminan",
    score: 95,
    fullMark: 100,
    grade: "A",
    subMetrics: [
      { name: "Coverage", value: "265%" },
      { name: "Jaminan mudah dicairkan", value: "✓" },
      { name: "Dokumen lengkap", value: "✓" },
    ],
  },
  {
    criterion: "Kondisi",
    score: 80,
    fullMark: 100,
    grade: "B",
    subMetrics: [
      { name: "Industri stabil", value: "✓" },
      { name: "Prospek positif", value: "✓" },
      { name: "Regulasi mendukung", value: "✓" },
    ],
  },
]

const chartConfig = {
  score: {
    label: "Skor",
    color: "hsl(var(--sanf-secondary))",
  },
} satisfies ChartConfig

function CustomChartTooltipContent({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataItem;
    return (
      <div className="rounded-md border bg-white p-2 text-sm shadow-md">
        <p className="font-bold">{label}</p>
        <p className="text-muted-foreground">Skor: {data.score}/100 (Grade {data.grade})</p>
        {data.subMetrics && data.subMetrics.length > 0 && (
          <div className="mt-2">
            <p className="font-semibold">Faktor Kontribusi:</p>
            {data.subMetrics.map((metric: SubMetric, index: number) => (
              <p key={index} className="text-xs">
                • {metric.name}: {metric.value}
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
  const overallScore = Math.round(chartData.reduce((sum, item) => sum + item.score, 0) / chartData.length);
  
  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Evaluasi 5C Kredit</CardTitle>
        <CardDescription>
          Penilaian berdasarkan Karakter, Kapasitas, Modal, Kondisi, dan Jaminan
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
          Skor Kredit Keseluruhan: {overallScore} <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}