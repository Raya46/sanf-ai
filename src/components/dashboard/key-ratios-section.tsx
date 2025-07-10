import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CategoryBar } from "@/components/app/ui/category-chart";

const ratios = [
  "Quick Ratio",
  "Current Ratio",
  "Debt to Equity Ratio",
  "Debt to EBITDA",
  "Total Liabilities Ratio",
  "EBITDA Interest Coverage Ratio",
  "Debt Service Coverage Ratio",
];

const ratioData: { [key: string]: { average: number; applicant: number } } = {
  "Quick Ratio": { average: 1.2, applicant: 0.8 },
  "Current Ratio": { average: 2.0, applicant: 1.5 },
  "Debt to Equity Ratio": { average: 0.5, applicant: 1.2 },
  "Debt to EBITDA": { average: 3.0, applicant: 4.5 },
  "Total Liabilities Ratio": { average: 0.6, applicant: 0.8 },
  "EBITDA Interest Coverage Ratio": { average: 5.0, applicant: 2.5 },
  "Debt Service Coverage Ratio": { average: 1.5, applicant: 0.9 },
};

export function KeyRatiosSection() {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-blue-600 mb-4">Key Ratios</h3>
      <div className="space-y-3">
        {ratios.map((ratio) => {
          const data = ratioData[ratio];
          const targetValue = data.average;
          const ratioValue = data.applicant;
          const maxValue = Math.max(targetValue, ratioValue) * 1.2; // Add some buffer

          return (
            <div
              key={ratio}
              className="py-2 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 text-sm">{ratio}</span>
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
                      <p>Information about {ratio}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CategoryBar
                values={[targetValue, maxValue - targetValue]}
                marker={{ value: ratioValue, tooltip: `Ratio: ${ratioValue}` }}
                colors={["red", "green"]}
                className="w-full"
                showLabels={false}
              />
              <div className="flex justify-between text-xs text-zinc-600 mt-1">
                <span>Target: {targetValue}</span>
                <span>Ratio: {ratioValue}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
