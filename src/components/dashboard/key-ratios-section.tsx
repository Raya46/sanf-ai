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
              parsedValue = parseFloat(value.replace(/[^\d.]/g, ""));
            } else {
              parsedValue =
                typeof value === "number" ? value : parseFloat(value);
            }
            const displayValue = !isNaN(parsedValue) ? parsedValue : value;

            // Define thresholds and directions for each risk parameter
            const thresholds: {
              [key: string]: {
                standard: number;
                direction: "greater" | "less";
                maxValue: number;
              };
            } = {
              dscr: { standard: 1.3, direction: "greater", maxValue: 5 },
              cashRatio: { standard: 0.3, direction: "greater", maxValue: 2 },
              quickRatio: { standard: 0.8, direction: "greater", maxValue: 2 },
              der: { standard: 3.5, direction: "less", maxValue: 5 },
              currentRatio: { standard: 1, direction: "greater", maxValue: 5 },
              debtToAsset: {
                standard: 50,
                direction: "less",
                maxValue: 100,
              },
              interestCoverage: {
                standard: 2,
                direction: "greater",
                maxValue: 12,
              },
              cashFlowOperation: {
                standard: 25,
                direction: "greater",
                maxValue: 50,
              },

              // Add more as needed
            };

            const config = thresholds[key] || {
              standard: 0,
              direction: "greater",
              maxValue: 100,
            }; // Default config

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
                    {config && (
                      <span className="mr-2 text-gray-500 text-xs">
                        Target: {config.direction === "greater" ? ">=" : "<="}{" "}
                        {config.standard}
                      </span>
                    )}
                    (Value: {String(value)})
                  </span>
                </div>
                {/* CategoryBar di bawah row label-value */}
                <div className="mt-2">
                  {(() => {
                    const ratioValue = parsedValue;
                    const standardValue = config.standard;
                    const maxValue = config.maxValue;
                    const direction = config.direction;

                    let colors: ("red" | "green")[];
                    let barValues: [number, number];

                    if (direction === "greater") {
                      // Red up to standard, green after standard
                      colors = ["red", "green"];
                      barValues = [
                        standardValue,
                        Math.max(0, maxValue - standardValue),
                      ];
                    } else {
                      // Green up to standard, red after standard
                      colors = ["green", "red"];
                      barValues = [
                        standardValue,
                        Math.max(0, maxValue - standardValue),
                      ];
                    }

                    // Clamp ratioValue between 0 and maxValue for correct marker display
                    const clampedRatioValue = Math.min(
                      Math.max(0, ratioValue),
                      maxValue
                    );

                    return (
                      <CategoryBar
                        values={barValues}
                        marker={{
                          value: clampedRatioValue,
                          tooltip: `Ratio: ${ratioValue}`, // Show original ratioValue in tooltip
                        }}
                        colors={colors}
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
