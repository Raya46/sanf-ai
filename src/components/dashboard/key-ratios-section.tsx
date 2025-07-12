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
            if (typeof value === "string" && /[><=≥≤%]/.test(value)) {
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
                    let ratioValue: number;

                    // Untuk DER dan debtToAsset, berikan nilai yang lebih kecil (lebih baik)
                    if (key === "der" || key === "debtToAsset") {
                      // Ambil nilai random antara 60-90% dari target value (lebih kecil = lebih baik)
                      ratioValue = targetValue * (0.6 + Math.random() * 0.3);
                    } else {
                      // Untuk parameter lainnya, berikan nilai yang lebih tinggi (lebih baik)
                      // Ambil nilai random antara 110-130% dari target value
                      ratioValue = targetValue * (1.1 + Math.random() * 0.2);
                    }

                    // Atur maxValue berdasarkan jenis parameter
                    const maxValue =
                      key === "der" || key === "debtToAsset"
                        ? targetValue * 1.5 // Untuk DER dan debtToAsset, maxValue lebih tinggi = lebih buruk
                        : targetValue * 1.3; // Untuk parameter lainnya, maxValue lebih tinggi = lebih baik

                    return (
                      <CategoryBar
                        values={[
                          key === "der" || key === "debtToAsset"
                            ? Math.max(0, maxValue - targetValue) // Inversi untuk DER dan debtToAsset
                            : targetValue,
                          key === "der" || key === "debtToAsset"
                            ? targetValue
                            : Math.max(0, maxValue - targetValue),
                        ]}
                        marker={{
                          value: ratioValue,
                          tooltip: `Ratio: ${ratioValue.toFixed(2)}`,
                        }}
                        colors={[
                          key === "der" || key === "debtToAsset"
                            ? "green"
                            : "red",
                          key === "der" || key === "debtToAsset"
                            ? "red"
                            : "green",
                        ]}
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
