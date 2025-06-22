import { Edit, File, Moon, TriangleAlert } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Separator } from "../ui/separator";
import * as React from "react";

const chartData = [
  { status: "new", count: 10, fill: "var(--color-new)" },
  { status: "review", count: 10, fill: "var(--color-review)" },
  { status: "pending", count: 5, fill: "var(--color-pending)" },
];

const chartConfig = {
  count: {
    label: "Count",
  },
  new: {
    label: "Pengajuan Baru",
    color: "#007BFF",
  },
  review: {
    label: "Menunggu Tinjauan Manual",
    color: "#28A745",
  },
  pending: {
    label: "Keputusan Tertunda",
    color: "#FFC107",
  },
} satisfies ChartConfig;

export function SectionCardStatus() {
  const totalApplications = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Status Alur Kerja Saat ini</CardTitle>
          <CardDescription className="text-[#007BFF]">
            Lihat Semua
          </CardDescription>
        </CardHeader>
        <div className="mx-4">
          <Separator />
        </div>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[200px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                innerRadius={50}
                strokeWidth={3}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {totalApplications}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-muted-foreground text-sm"
                          >
                            Total
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex flex-row justify-center gap-4">
          <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg">
            <File width={20} height={20} color="#007BFF" />
            <CardTitle className="font-bold text-lg">10</CardTitle>
            <CardDescription className="text-xs text-center">
              Pengajuan Baru
            </CardDescription>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg">
            <Edit width={20} height={20} color="#007BFF" />
            <CardTitle className="font-bold text-lg">10</CardTitle>
            <CardDescription className="text-xs text-center">
              Menunggu Tinjauan Manual
            </CardDescription>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg">
            <Moon width={20} height={20} color="#007BFF" />
            <CardTitle className="font-bold text-lg">5</CardTitle>
            <CardDescription className="text-xs text-center">
              Keputusan Tertunda
            </CardDescription>
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tugas & Item Tindakan</CardTitle>
          <CardDescription className="text-[#007BFF]">
            Lihat Semua
          </CardDescription>
        </CardHeader>
        <div className="mx-4">
          <Separator />
        </div>
        <div className="flex flex-row items-center mx-4 gap-3">
          <TriangleAlert height={20} width={20} color="#FF9800" />
          <div className="flex flex-col">
            <CardTitle>Tinjau Akun Overdue - PT XYZ</CardTitle>
            <CardDescription>
              Jatuh tempo: 05 Jun, 2025 Jatuh tempo hari ini
            </CardDescription>
          </div>
        </div>
        <div className="mx-4">
          <Separator />
        </div>
        <div className="flex flex-row items-center mx-4 gap-3">
          <TriangleAlert height={20} width={20} color="#FF9800" />
          <div className="flex flex-col">
            <CardTitle>Tinjau Akun Overdue - PT XYZ</CardTitle>
            <CardDescription>
              Jatuh tempo: 05 Jun, 2025 Jatuh tempo hari ini
            </CardDescription>
          </div>
        </div>
        <div className="mx-4">
          <Separator />
        </div>
        <div className="flex flex-row items-center mx-4 gap-3">
          <TriangleAlert height={20} width={20} color="#FF9800" />
          <div className="flex flex-col">
            <CardTitle>Tinjau Akun Overdue - PT XYZ</CardTitle>
            <CardDescription>
              Jatuh tempo: 05 Jun, 2025 Jatuh tempo hari ini
            </CardDescription>
          </div>
        </div>
      </Card>
    </div>
  );
}
