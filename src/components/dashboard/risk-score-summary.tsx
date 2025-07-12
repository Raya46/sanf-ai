"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Tipe data untuk setiap metrik risiko
interface RiskMetric {
  name: string;
  value: number; // Nilai persentase risiko (0-100)
}

// Data contoh (bisa diganti dengan data dari API)
const riskData: RiskMetric[] = [
  { name: "Character Risk", value: 20 },
  { name: "Capacity Risk", value: 25 },
  { name: "Capital Risk", value: 40 },
  { name: "Collateral Risk", value: 15 },
  { name: "Condition Risk", value: 45 },
];

// Fungsi untuk menentukan level dan warna berdasarkan nilai risiko
const getRiskDetails = (value: number) => {
  if (value <= 30) {
    return { level: "Low", color: "bg-green-500", textColor: "text-green-600" };
  }
  if (value <= 60) {
    return {
      level: "Medium",
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
    };
  }
  return { level: "High", color: "bg-red-500", textColor: "text-red-600" };
};

// Komponen helper untuk progress bar kustom
const RiskProgressBar = ({
  value,
  color,
}: {
  value: number;
  color: string;
}) => (
  <div className="h-2.5 w-full rounded-full bg-gray-200">
    <div
      className={`h-2.5 rounded-full ${color}`}
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

// Komponen utama untuk menampilkan ringkasan skor risiko
export function RiskScoreSummary() {
  // Menghitung risiko keseluruhan
  const calculateOverallRisk = (metrics: RiskMetric[]) => {
    if (metrics.length === 0) {
      return { name: "Overall Risk", value: 0 };
    }
    const avgRisk =
      metrics.reduce((acc, curr) => acc + curr.value, 0) / metrics.length;
    return { name: "Overall Risk", value: Math.round(avgRisk) };
  };

  const overallRisk = calculateOverallRisk(riskData);

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold text-gray-800">
          RISK SCORE SUMMARY
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 p-6">
        {/* Menampilkan setiap metrik risiko */}
        {riskData.map((metric) => {
          const details = getRiskDetails(metric.value);
          return (
            <div
              key={metric.name}
              className="grid grid-cols-3 items-center gap-4"
            >
              <span className="col-span-1 text-sm font-medium text-gray-600">
                {metric.name}:
              </span>
              <div className="col-span-2 flex items-center gap-3">
                <RiskProgressBar value={metric.value} color={details.color} />
                <span
                  className={`w-28 text-left font-semibold ${details.textColor}`}
                >
                  {details.level} ({metric.value}%)
                </span>
              </div>
            </div>
          );
        })}

        {/* Garis pemisah */}
        <div className="border-t border-gray-200"></div>

        {/* Menampilkan Risiko Keseluruhan */}
        <div className="grid grid-cols-3 items-center gap-4 pt-2">
          <span className="col-span-1 text-sm font-bold text-gray-800">
            Overall Risk:
          </span>
          <div className="col-span-2 flex items-center gap-3">
            <RiskProgressBar value={overallRisk.value} color="bg-blue-600" />
            <span className="w-28 text-left font-bold text-blue-700">
              {getRiskDetails(overallRisk.value).level} ({overallRisk.value}%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
