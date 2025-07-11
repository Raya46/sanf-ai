"use client";

import { useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  ComposedChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Bar,
  Customized,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FinancialCandlestickData {
  period: string;
  startValue: number;
  maxValue: number;
  minValue: number;
  endValue: number;
}

const periods = [
  { id: "annually", label: "Annually" },
  { id: "quarterly", label: "Quarterly" },
  { id: "monthly", label: "Monthly" },
];

interface CustomCandlestickProps {
  data: FinancialCandlestickData[];
  xAxisMap: Record<string, { scale: (value: any) => number }>;
  yAxisMap: Record<string, { scale: (value: any) => number }>;
  offset: any;
  height: number;
}

interface MainChartProps {
  period: string;
  onPeriodChange: (period: string) => void;
  revenueData: {
    year: number;
    month: number;
    revenue: number;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-md text-sm">
        <p className="font-semibold">{`Period: ${label}`}</p>
        <p>{`Start Value: ${data.startValue}`}</p>
        <p>{`Max Value: ${data.maxValue}`}</p>
        <p>{`Min Value: ${data.minValue}`}</p>
        <p>{`End Value: ${data.endValue}`}</p>
      </div>
    );
  }
  return null;
};
const CustomCandlestick = ({
  data,
  xAxisMap,
  yAxisMap,
  offset,
}: CustomCandlestickProps) => {
  const xAxis = Object.values(xAxisMap)[0];
  const yAxis = Object.values(yAxisMap)[0];

  const xScale = xAxis.scale;
  const yScale = yAxis.scale;
  const barWidth = 10;

  return (
    <g>
      {data.map((entry, index) => {
        const x = xScale(entry.period) - barWidth / 2;
        const yStart = yScale(entry.startValue);
        const yEnd = yScale(entry.endValue);
        const yHigh = yScale(entry.maxValue);
        const yLow = yScale(entry.minValue);

        const rectY = Math.min(yStart, yEnd);
        const rectHeight = Math.abs(yStart - yEnd) || 1;
        const isRising = entry.endValue > entry.startValue;
        const color = isRising ? "#10B981" : "#EF4444";

        return (
          <g key={`candlestick-${index}`}>
            <line
              x1={x + barWidth / 2}
              y1={yHigh}
              x2={x + barWidth / 2}
              y2={yLow}
              stroke={color}
              strokeWidth={1}
            />
            <rect
              x={x}
              y={rectY}
              width={barWidth}
              height={rectHeight}
              fill={color}
              stroke={color}
            />
          </g>
        );
      })}
    </g>
  );
};

export function MainChart({
  period,
  onPeriodChange,
  revenueData,
}: MainChartProps) {
  const normalizePeriod = (p: string): "annually" | "quarterly" | "monthly" => {
    if (p === "annually" || p === "quarterly" || p === "monthly") return p;
    return "monthly";
  };

  const transformRevenueToCandlestick = (
    data: { year: number; month: number; revenue: number }[]
  ): FinancialCandlestickData[] => {
    return data.map((item, index, array) => {
      const prev = array[index - 1]?.revenue ?? item.revenue;
      const next = array[index + 1]?.revenue ?? item.revenue;

      return {
        period: `${item.year}-${String(item.month).padStart(2, "0")}`,
        startValue: prev,
        maxValue: Math.max(prev, item.revenue, next),
        minValue: Math.min(prev, item.revenue, next),
        endValue: item.revenue,
      };
    });
  };

  const getFilteredData = useCallback(
    (p: string) => {
      const transformed = transformRevenueToCandlestick(revenueData);

      if (p === "annually") {
        const grouped = Object.values(
          transformed.reduce(
            (acc, curr) => {
              const year = curr.period.split("-")[0];
              if (!acc[year]) acc[year] = [];
              acc[year].push(curr);
              return acc;
            },
            {} as Record<string, FinancialCandlestickData[]>
          )
        ).map((yearGroup) => {
          const first = yearGroup[0];
          const last = yearGroup[yearGroup.length - 1];
          return {
            period: first.period.split("-")[0],
            startValue: first.startValue,
            endValue: last.endValue,
            maxValue: Math.max(...yearGroup.map((d) => d.maxValue)),
            minValue: Math.min(...yearGroup.map((d) => d.minValue)),
          };
        });
        return grouped;
      }

      if (p === "quarterly") {
        const quarters = ["Q1", "Q2", "Q3", "Q4"];
        const grouped = Object.values(
          transformed.reduce(
            (acc, curr) => {
              const [year, month] = curr.period.split("-").map(Number);
              const quarter = Math.ceil(month / 3);
              const key = `${year} ${quarters[quarter - 1]}`;
              if (!acc[key]) acc[key] = [];
              acc[key].push(curr);
              return acc;
            },
            {} as Record<string, FinancialCandlestickData[]>
          )
        ).map((group) => {
          const first = group[0];
          const last = group[group.length - 1];
          return {
            period: `${first.period.split("-")[0]} Q${Math.ceil(
              Number(first.period.split("-")[1]) / 3
            )}`,
            startValue: first.startValue,
            endValue: last.endValue,
            maxValue: Math.max(...group.map((d) => d.maxValue)),
            minValue: Math.min(...group.map((d) => d.minValue)),
          };
        });
        return grouped;
      }

      return transformed; // default to monthly
    },
    [revenueData]
  );

  const chartData = useMemo(
    () => getFilteredData(normalizePeriod(period)),
    [period, getFilteredData]
  );

  const averageRevenue =
    chartData.reduce(
      (sum: number, item: FinancialCandlestickData) => sum + item.endValue,
      0
    ) / chartData.length || 0;

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-md border border-gray-200">
          {periods.map((p) => (
            <Button
              key={p.id}
              variant={normalizePeriod(period) === p.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onPeriodChange(p.id)}
              className={
                normalizePeriod(period) === p.id
                  ? "bg-blue-500 hover:bg-blue-600 text-white text-xs"
                  : "text-gray-600 hover:text-gray-900 text-xs"
              }
            >
              {p.label}
            </Button>
          ))}
        </div>
        <Button
          size="sm"
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="period"
              tick={{ fill: "#4B5563", fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tick={{ fill: "#4B5563", fontSize: 12 }}
              domain={["auto", "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={averageRevenue}
              stroke="red"
              strokeDasharray="3 3"
              label="Avg"
            />
            <Bar dataKey="endValue" fill="transparent" />
            <Customized
              component={(props: any) => (
                <CustomCandlestick
                  data={chartData}
                  xAxisMap={props.xAxisMap}
                  yAxisMap={props.yAxisMap}
                  offset={props.offset}
                  height={props.height}
                />
              )}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2">
        <h3 className="text-lg font-semibold mb-4">🧠 AI Insights</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Category</TableHead>
              <TableHead>Insight</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Profitability</TableCell>
              <TableCell>
                Revenue grew 12% YoY but gross margin fell to 38%, suggesting input cost pressures.
                Net profit margin stable at 9.8%, driven by SG&A control.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Liquidity & Leverage</TableCell>
              <TableCell>
                Current ratio fell to 1.2; liquidity slightly stressed.
                D/E ratio of 2.6 indicates over-leverage risk.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Cash Flow</TableCell>
              <TableCell>
                Operating cash flow down 18% YoY, lagging revenue growth.
                FCF remains negative due to high CapEx; cash burn unsustainable long-term.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Anomalies</TableCell>
              <TableCell>
                Receivables aging increased from 38 to 63 days.
                Inventory turnover dropped by 25%, indicating excess stock or poor demand.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Forecast & Risk Tier</TableCell>
              <TableCell>
                Z-score: 1.7 (Distress Zone)
                Runway: ~7.2 months
                Recommended Action: Reduce credit exposure, suggest cashflow restructuring.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
