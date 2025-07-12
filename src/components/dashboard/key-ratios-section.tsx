"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type CreditApplication } from "@/lib/types";
import { CategoryBar } from "@/components/app/ui/category-chart";

interface KeyRatiosSectionProps {
  applicationData: CreditApplication;
}

export function KeyRatiosSection({ applicationData }: KeyRatiosSectionProps) {
  // Data untuk Risk Parameters yang didefinisikan pengguna
  const riskParameters = applicationData.risk_parameter || {};

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Risk Parameters
      </h3>
      {Object.keys(riskParameters).length > 0 ? (
        <div className="space-y-3">
          {Object.entries(riskParameters).map(([key, value]) => {
            const label = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase());

            // Parse value: if contains '>', '<', '>=', '<=', '≥', '≤', strip and parseInt
            let parsedValue: number;
            if (typeof value === "string" && /[><=≥≤]/.test(value)) {
              parsedValue = parseInt(value.replace(/[^\d.]/g, ""));
            } else {
              parsedValue = typeof value === "number" ? value : parseInt(value);
            }
            const displayValue = !isNaN(parsedValue) ? parsedValue : value;

            return (
              <div
                key={key}
                className="border-b border-gray-100 py-2 text-sm last:border-b-0"
              >
                {/* Row label dan value asli */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="capitalize text-gray-700">{label}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="ml-1 h-4 w-4 text-blue-400 hover:text-blue-600"
                          >
                            <Info className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>User-defined risk parameter.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="ml-2 font-mono text-gray-600">
                    {String(value)}
                  </span>
                </div>
                {/* CategoryBar di bawah row label-value */}
                <div className="mt-2">
                  {(() => {
                    const targetValue = parsedValue;
                    const ratioValue = parsedValue;
                    // maxValue random antara 1.2x sampai 2x targetValue
                    const randomFactor = 1.2 + Math.random() * 0.8;
                    const maxValue = Math.max(
                      targetValue * randomFactor,
                      targetValue + 1
                    );
                    return (
                      <CategoryBar
                        values={[
                          targetValue,
                          Math.max(0, maxValue - targetValue),
                        ]}
                        marker={{
                          value: ratioValue,
                          tooltip: `Ratio: ${ratioValue}`,
                        }}
                        colors={["red", "green"]}
                        className="w-full"
                        showLabels={false}
                      />
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          No custom risk parameters defined.
        </p>
      )}
    </div>
  );
}
