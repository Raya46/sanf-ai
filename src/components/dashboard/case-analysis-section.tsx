import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const analysisItems = [
  "Risk Assessment Insights by Metric",
  "Comprehensive Footnote Summary",
  "Critical Footnote Analysis",
  "Line of Credit Analysis",
];

export function CaseAnalysisSection() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
          Case Analysis
        </h3>
        <div className="space-y-4">
          {/* Placeholder content blocks */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="space-y-4">
          {analysisItems.map((item) => (
            <div
              key={item}
              className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
            >
              <span className="text-gray-700 text-sm">{item}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-4 w-4 text-blue-500"
                    >
                      <Info className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Information about {item}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
