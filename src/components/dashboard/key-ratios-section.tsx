import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CategoryBar } from "@/components/app/ui/category-chart";
import { type CreditApplication } from "@/lib/types";

interface KeyRatiosSectionProps {
  applicationData: CreditApplication;
}

export function KeyRatiosSection({ applicationData }: KeyRatiosSectionProps) {
  const ratios = [
    {
      label: "Quick Ratio",
      key: "quick_ratio",
      info: "Measures a company's ability to meet its short-term obligations with its most liquid assets.",
    },
    {
      label: "Current Ratio",
      key: "current_ratio",
      info: "Indicates a company's ability to pay off its short-term liabilities with its current assets.",
    },
    {
      label: "Debt to EBITDA",
      key: "debt_to_ebitda",
      info: "Assesses a company's ability to pay off its incurred debt.",
    },
    {
      label: "Debt to Equity Ratio",
      key: "debt_to_equity_ratio",
      info: "Measures the proportion of equity and debt used to finance a company's assets.",
    },
    {
      label: "Total Liabilities Ratio",
      key: "total_liabilities_ratio",
      info: "Indicates the proportion of a company's assets that are financed by debt.",
    },
    {
      label: "Debt Service Coverage Ratio",
      key: "debt_service_coverage_ratio",
      info: "Measures a company's ability to pay its current debt obligations.",
    },
    {
      label: "EBITDA Interest Coverage Ratio",
      key: "ebitda_interest_coverage_ratio",
      info: "Measures a company's ability to pay interest on its outstanding debt.",
    },
  ];

  const getRatioValue = (ratioKey: keyof typeof applicationData.key_ratios) => {
    return applicationData.key_ratios?.[ratioKey]?.ratio || 0;
  };

  const getTargetValue = (
    ratioKey: keyof typeof applicationData.key_ratios
  ) => {
    return applicationData.key_ratios?.[ratioKey]?.target || 0;
  };
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-blue-600 mb-4">Key Ratios</h3>
      <div className="space-y-3">
        {ratios.map((ratio) => {
          const ratioValue = getRatioValue(
            ratio.key as keyof typeof applicationData.key_ratios
          );
          const targetValue = getTargetValue(
            ratio.key as keyof typeof applicationData.key_ratios
          );
          const maxValue = Math.max(targetValue, ratioValue) * 1.2; // Add some buffer

          return (
            <div
              key={ratio.key}
              className="py-2 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 text-sm">{ratio.label}</span>
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
                      <p>{ratio.info}</p>
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
