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
  trend?: "positive" | "negative";
  hasInfo?: boolean;
}

interface CombinedMetricsCardProps {
  metrics: Metric[];
  title: string;
}

export function CombinedMetricsCard({
  metrics,
  title,
}: CombinedMetricsCardProps) {
  return (
    <div className="bg-white rounded-lg h-full p-6 border border-gray-200 shadow-sm relative">
      <div className="flex justify-between items-center pb-6 border-b border-gray-200 mb-6">
        <h2 className="text-3xl font-bold text-sanf-primary">{title}</h2>
        <a href="#" className="text-sanf-primary hover:underline text-sm">
          Expand view
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        {metrics.map((metric) => (
          <div key={metric.label} className="text-center">
            <div className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-2 mb-1">
              <span>{metric.value}</span>
              {metric.trend === "positive" && (
                <ArrowUp className="h-5 w-5 text-green-500" />
              )}
              {metric.trend === "negative" && (
                <ArrowDown className="h-5 w-5 text-red-500" />
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
                      <p>Additional information about {metric.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
