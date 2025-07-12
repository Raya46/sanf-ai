import { Info, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

interface Metric {
  label: string;
  value: string;
  subtitle?: string;
  trend?: "positive" | "negative";
  hasInfo?: boolean;
}

interface CombinedMetricsCardProps {
  metrics: Metric[];
  title: string;
  isLoading?: boolean;
}

function formatNumberLabel(value: string): string {
  // Remove non-digit characters except comma and period
  const cleaned = value.replace(/[^\d.,]/g, "");
  // Try to parse as number
  const num = Number(cleaned.replace(/,/g, ""));
  if (isNaN(num) || num === 0) return value;

  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)} Miliar`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)} Juta`;
  }
  return value;
}

export function CombinedMetricsCard({
  metrics,
  title,
}: CombinedMetricsCardProps) {
  return (
    <div className="bg-white rounded-lg h-full p-6 border border-gray-200 shadow-sm relative">
      <div className="flex justify-between items-center pb-6 border-b border-gray-200 mb-6">
        <h2 className="text-3xl font-bold text-sanf-primary">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        {metrics.map((metric) => (
          <div key={metric.label} className="text-center">
            <div className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-2 mb-1">
              {metric.value ? (
                <>
                  <span>{formatNumberLabel(metric.value)}</span>
                  {metric.trend === "positive" && (
                    <ArrowUp className="h-5 w-5 text-green-500" />
                  )}
                  {metric.trend === "negative" && (
                    <ArrowDown className="h-5 w-5 text-red-500" />
                  )}
                </>
              ) : (
                <Skeleton className="h-8 w-32" />
              )}
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-sm text-gray-600">{metric.label}</span>
              {metric.hasInfo && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-4 w-4 text-purple-500"
                      >
                        <Info className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Informasi tambahan tentang {metric.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {metric.subtitle && (
              <div className="text-xs text-gray-500 mt-1">
                {metric.subtitle}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
