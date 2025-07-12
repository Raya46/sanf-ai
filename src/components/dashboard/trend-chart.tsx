"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Data untuk chart, menggabungkan data Anda dan data rekaan yang realistis
const chartData = [
  {
    name: "NPM",
    "2023": 20.5,
    "2024": 22.8,
  },
  {
    name: "ROA",
    "2023": 8.8, // Data rekaan, sedikit di bawah 2024 untuk menunjukkan pertumbuhan
    "2024": 10.3,
  },
  {
    name: "ROE",
    "2023": 17.1, // Data rekaan, sedikit di bawah 2024 untuk menunjukkan pertumbuhan
    "2024": 19.5,
  },
  {
    name: "Current Ratio",
    "2023": 1.5, // Data rekaan
    "2024": 1.8, // Data rekaan
  },
  {
    name: "Quick Ratio",
    "2023": 1.1, // Data rekaan
    "2024": 1.3, // Data rekaan
  },
  {
    name: "DER",
    "2023": 0.8, // Data rekaan
    "2024": 0.7, // Data rekaan (lebih rendah lebih baik)
  },
];

// Tooltip kustom untuk menampilkan informasi saat hover
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // PERBAIKAN: Definisikan warna secara eksplisit untuk memastikan konsistensi
    const colors: { [key: string]: string } = {
      "2023": "#2563eb", // Warna biru tua
      "2024": "#60a5fa", // Warna biru muda
    };

    return (
      // PERBAIKAN: Menggunakan bg-white secara eksplisit untuk menghindari masalah tema
      <div className="rounded-lg border bg-white p-2 text-sm shadow-sm">
        <p className="font-bold">{label}</p>
        {payload.map((entry: any, index: number) => (
          // PERBAIKAN: Menggunakan map warna yang sudah didefinisikan
          <p
            key={`item-${index}`}
            style={{ color: colors[entry.dataKey] || entry.color }}
          >
            {`${entry.name}: ${entry.value}%`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function PerformanceBarChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Perbandingan Kinerja Finansial</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "hsl(var(--muted))" }}
              />
              <Legend
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ paddingTop: "20px" }}
              />
              <Bar
                dataKey="2023"
                fill="#2563eb" // Warna biru tua
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="2024"
                fill="#60a5fa" // Warna biru muda/teal
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
