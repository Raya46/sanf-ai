"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const chartData = [
  { period: "[A] 01/25 - 12/25", companyA: 4, companyB: 2, companyC: -1 },
  { period: "[A] 01/24 - 12/24", companyA: 3, companyB: 1.5, companyC: -2 },
  { period: "[A] 01/23 - 12/23", companyA: 2, companyB: 1, companyC: -1.5 },
  { period: "[A] 01/22 - 12/22", companyA: 3.5, companyB: 0.5, companyC: -2.5 },
  { period: "[A] 01/21 - 12/21", companyA: 2.5, companyB: 1.2, companyC: -3 },
  { period: "[A] 01/20 - 12/20", companyA: 4.2, companyB: 0.8, companyC: -2.8 },
  { period: "[A] 01/19 - 12/19", companyA: 3.8, companyB: 1.1, companyC: -1.8 },
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
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <XAxis
              dataKey="period"
              tick={{ fill: "#4B5563", fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fill: "#4B5563", fontSize: 12 }} />
            <Bar dataKey="companyA" fill="#3B82F6" />
            <Bar dataKey="companyB" fill="#93C5FD" />
            <Bar dataKey="companyC" fill="#1E40AF" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Company A</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-300 rounded"></div>
          <span className="text-sm text-gray-600">Company B</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-800 rounded"></div>
          <span className="text-sm text-gray-600">Company C</span>
        </div>
      </div>
    </div>
  );
}
