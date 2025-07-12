"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  ComposedChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Bar,
} from "recharts";

// Tipe data untuk data candlestick yang diterima sebagai prop
interface FinancialCandlestickData {
  period: string;
  startValue: number;
  maxValue: number;
  minValue: number;
  endValue: number;
}

// Interface props untuk komponen ini
interface MainChartProps {
  // Menerima data yang sudah dalam format candlestick
  chartData: FinancialCandlestickData[];
}

// Data untuk tombol periode
const periods = [
  { id: "annually", label: "Tahunan" },
  { id: "quarterly", label: "Kuartalan" },
  { id: "monthly", label: "Bulanan" },
];

// Tooltip kustom saat hover di atas chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // PERBAIKAN: Mengalikan nilai dengan 1000 sebelum ditampilkan
    const data = {
      ...payload[0].payload,
      startValue: payload[0].payload.startValue * 1000,
      endValue: payload[0].payload.endValue * 1000,
      minValue: payload[0].payload.minValue * 1000,
      maxValue: payload[0].payload.maxValue * 1000,
    };
    const isRising = data.endValue >= data.startValue;
    const change = data.endValue - data.startValue;
    const changePercent =
      data.startValue !== 0 ? (change / data.startValue) * 100 : 0;

    return (
      <div className="rounded-lg border bg-white p-3 text-sm shadow-md">
        <p className="font-semibold">{label}</p>
        <p>
          Value:{" "}
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(data.endValue)}
        </p>
        <p className={isRising ? "text-green-600" : "text-red-600"}>
          Change:{" "}
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(change)}{" "}
          ({changePercent.toFixed(2)}%)
        </p>
      </div>
    );
  }
  return null;
};

// PERBAIKAN: Komponen Candlestick yang lebih aman
const CustomCandlestick = (props: any) => {
  const {
    x,
    y,
    width,
    height,
    startValue,
    endValue,
    maxValue,
    minValue,
    yAxis,
  } = props;

  if (
    [x, y, width, height, startValue, endValue, maxValue, minValue].some(
      (val) => val === undefined || isNaN(val)
    )
  ) {
    return null;
  }

  const isRising = endValue >= startValue;
  const color = isRising ? "#10B981" : "#EF4444";

  const canRenderWick = yAxis && typeof yAxis.scale === "function";

  return (
    <g>
      {canRenderWick && (
        <line
          x1={x + width / 2}
          y1={yAxis.scale(minValue)}
          x2={x + width / 2}
          y2={yAxis.scale(maxValue)}
          stroke={color}
          strokeWidth={2}
        />
      )}
      {/* Selalu gambar badan lilin */}
      <rect x={x} y={y} width={width} height={height} fill={color} />
    </g>
  );
};

export function MainChart({ chartData = [] }: MainChartProps) {
  const [activePeriod, setActivePeriod] = useState("annually");

  const processedData = useMemo(() => {
    // PERBAIKAN: Filter data yang tidak valid di awal untuk mencegah NaN
    const validData = chartData
      ? chartData.filter(
          (d) =>
            typeof d.startValue === "number" &&
            !isNaN(d.startValue) &&
            typeof d.endValue === "number" &&
            !isNaN(d.endValue) &&
            typeof d.minValue === "number" &&
            !isNaN(d.minValue) &&
            typeof d.maxValue === "number" &&
            !isNaN(d.maxValue)
        )
      : [];

    if (validData.length === 0) return [];

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    const parsePeriod = (period: string) => {
      const [monthStr, yearStr] = period.split(" ");
      const monthIndex = monthNames.findIndex((m) => m === monthStr);
      return new Date(parseInt(yearStr), monthIndex, 1);
    };

    let aggregatedData: FinancialCandlestickData[];

    switch (activePeriod) {
      case "annually": {
        const yearlyData: { [key: string]: FinancialCandlestickData[] } = {};
        validData.forEach((d) => {
          const year = d.period.split(" ")[1];
          if (!yearlyData[year]) yearlyData[year] = [];
          yearlyData[year].push(d);
        });
        aggregatedData = Object.keys(yearlyData).map((year) => {
          const yearGroup = yearlyData[year];
          return {
            period: year,
            startValue: yearGroup[0].startValue,
            endValue: yearGroup[yearGroup.length - 1].endValue,
            maxValue: Math.max(...yearGroup.map((d) => d.maxValue)),
            minValue: Math.min(...yearGroup.map((d) => d.minValue)),
          };
        });
        break;
      }
      case "quarterly": {
        const quarterlyData: { [key: string]: FinancialCandlestickData[] } = {};
        validData.forEach((d) => {
          const date = parsePeriod(d.period);
          const year = date.getFullYear();
          const quarter = `Q${Math.floor(date.getMonth() / 3) + 1}`;
          const key = `${year}-${quarter}`;
          if (!quarterlyData[key]) quarterlyData[key] = [];
          quarterlyData[key].push(d);
        });
        aggregatedData = Object.keys(quarterlyData).map((key) => {
          const quarterGroup = quarterlyData[key];
          return {
            period: key,
            startValue: quarterGroup[0].startValue,
            endValue: quarterGroup[quarterGroup.length - 1].endValue,
            maxValue: Math.max(...quarterGroup.map((d) => d.maxValue)),
            minValue: Math.min(...quarterGroup.map((d) => d.minValue)),
          };
        });
        break;
      }
      default: // monthly
        aggregatedData = validData;
    }

    // Scaling data setelah agregasi
    return aggregatedData.map((item) => ({
      ...item,
      startValue: item.startValue / 1000,
      endValue: item.endValue / 1000,
      minValue: item.minValue / 1000,
      maxValue: item.maxValue / 1000,
    }));
  }, [chartData, activePeriod]);

  if (!processedData || processedData.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-gray-500">Data analisis chart tidak tersedia.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-1 rounded-md border border-gray-200 bg-gray-100 p-1">
          {periods.map((p) => (
            <Button
              key={p.id}
              variant={activePeriod === p.id ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActivePeriod(p.id)}
              className="text-xs"
            >
              {p.label}
            </Button>
          ))}
        </div>
        <Button size="sm" variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={processedData}
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
            <YAxis
              tick={{ fill: "#4B5563", fontSize: 12 }}
              domain={["dataMin - 10", "dataMax + 10"]}
              tickFormatter={(value) =>
                new Intl.NumberFormat("id-ID", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value * 1000)
              }
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(239, 246, 255, 0.5)" }}
            />

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
