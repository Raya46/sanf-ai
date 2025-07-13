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
// PERBAIKAN: Menambahkan impor untuk komponen Tabel
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    const colors: { [key: string]: string } = {
      "2023": "#2563eb", // Warna biru tua
      "2024": "#60a5fa", // Warna biru muda
    };

    return (
      <div className="rounded-lg border bg-white p-2 text-sm shadow-sm">
        <p className="font-bold">{label}</p>
        {payload.map((entry: any, index: number) => (
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
        <CardTitle>TREN RASIO KEUANGAN 2023-2024</CardTitle>
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
                // PERBAIKAN: Mengubah fill menjadi transparan untuk menghilangkan background hitam saat hover
                cursor={{ fill: "transparent" }}
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

        {/* PERBAIKAN: Menambahkan bagian AI Insights di bawah chart */}
        <div className="mt-8">
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
                <TableCell className="font-medium">Kecukupan Jaminan</TableCell>
                <TableCell>
                  Coverage ratio 265% jauh melebihi minimum yang disyaratkan
                  (150%). Nilai agunan Rp 26.5 miliar memberikan margin keamanan
                  yang sangat baik. Seluruh agunan merupakan aset produktif yang
                  mendukung operasional tambang. Nilai pasar agunan diperkirakan
                  terus meningkat selama masa pembiayaan.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Komposisi Agunan</TableCell>
                <TableCell>
                  Alat Berat: Rp 14.500.000.000 (54,72% dari total agunan).
                  Properti: Rp 12.000.000.000 (45,28% dari total agunan).
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Penilaian Agunan</TableCell>
                <TableCell>
                  Penilaian Internal (01 Juli 2025): Rp 24.800.000.000. KJPP
                  Independen (05 Juli 2025): Rp 26.500.000.000.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
