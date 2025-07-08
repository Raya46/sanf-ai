import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ratios = [
  "Quick Ratio",
  "Current Ratio",
  "Debt to Equity Ratio",
  "Debt to EBITDA",
  "Total Liabilities Ratio",
  "EBITDA Interest Coverage Ratio",
  "Debt Service Coverage Ratio",
];

export function KeyRatiosSection() {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-blue-600 mb-4">Key Ratios</h3>
      <div className="space-y-3">
        {ratios.map((ratio) => (
          <div
            key={ratio}
            className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
          >
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
        ))}
      </div>
    </div>
  );
}
