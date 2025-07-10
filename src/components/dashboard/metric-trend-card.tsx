import { ArrowUp, ArrowDown } from "lucide-react";

interface MetricTrendCardProps {
  title: string;
  value: string;
  delta: string;
  deltaType: "positive" | "negative";
  trend: "up" | "down";
}

export function MetricTrendCard({
  title,
  value,
  delta,
  deltaType,
  trend,
}: MetricTrendCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <span className="text-base font-bold text-sanf-primary">{title}</span>
        {trend === "up" ? (
          <ArrowUp className="h-5 w-5 text-green-500" />
        ) : (
          <ArrowDown className="h-5 w-5 text-red-500" />
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
      <div
        className={`text-base font-medium ${
          deltaType === "positive" ? "text-green-500" : "text-red-500"
        }`}
      >
        {delta}
      </div>
    </div>
  );
}
