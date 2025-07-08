"use client";

import { useState } from "react";
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
  Line,
} from "recharts";

interface FinancialCandlestickData {
  period: string;
  startValue: number;
  maxValue: number;
  minValue: number;
  endValue: number;
}

const chartData: FinancialCandlestickData[] = [
  { period: "Jan 2025", startValue: 100, maxValue: 120, minValue: 90, endValue: 110 },
  { period: "Feb 2025", startValue: 110, maxValue: 130, minValue: 105, endValue: 125 },
  { period: "Mar 2025", startValue: 125, maxValue: 115, minValue: 95, endValue: 100 },
  { period: "Apr 2025", startValue: 100, maxValue: 110, minValue: 98, endValue: 108 },
  { period: "May 2025", startValue: 108, maxValue: 128, minValue: 100, endValue: 120 },
  { period: "Jun 2025", startValue: 120, maxValue: 110, minValue: 90, endValue: 95 },
  { period: "Jul 2025", startValue: 95, maxValue: 105, minValue: 85, endValue: 100 },
];

const periods = [
  { id: "annually", label: "Annually" },
  { id: "quarterly", label: "Quarterly" },
  { id: "monthly", label: "Monthly" },
];

interface MainChartProps {
  period: string;
  onPeriodChange: (period: string) => void;
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

const CustomCandlestick = (props: any) => {
  const { x, y, width, startValue, maxValue, minValue, endValue } = props;

  const isRising = endValue > startValue;
  const color = isRising ? "#10B981" : "#EF4444"; // Green for up, Red for down

  const rectY = Math.min(startValue, endValue);
  const rectHeight = Math.abs(startValue - endValue);

  return (
    <g>
      {/* Line for high and low */}
      <line
        x1={x + width / 2}
        y1={maxValue}
        x2={x + width / 2}
        y2={minValue}
        stroke={color}
        strokeWidth={1}
      />
      {/* Rectangle for open and close */}
      <rect
        x={x}
        y={rectY}
        width={width}
        height={rectHeight}
        fill={color}
        stroke={color}
      />
    </g>
  );
};

export function MainChart({ period, onPeriodChange }: MainChartProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-md border border-gray-200">
          {periods.map((p) => (
            <Button
              key={p.id}
              variant={period === p.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onPeriodChange(p.id)}
              className={
                period === p.id
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

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="period"
              tick={{ fill: "#4B5563", fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fill: "#4B5563", fontSize: 12 }} domain={["dataMin - 10", "dataMax + 10"]} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={105} stroke="red" strokeDasharray="3 3" label="Avg" />
            <Bar
              dataKey="endValue"
              shape={<CustomCandlestick />}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={300}
              animationEasing="ease-out"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
