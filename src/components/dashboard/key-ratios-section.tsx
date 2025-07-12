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

interface KeyRatiosSectionProps {
  applicationData: CreditApplication;
}

export function KeyRatiosSection({ applicationData }: KeyRatiosSectionProps) {
  const riskParameters = applicationData.risk_parameter || {};

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-blue-600">
        Risk Parameters
      </h3>
      <div className="space-y-3">
        {Object.keys(riskParameters).length > 0 ? (
          Object.entries(riskParameters).map(([key, value]) => {
            // Mengubah camelCase menjadi teks yang bisa dibaca (e.g., derMaksimal -> Der Maksimal)
            const label = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase());
            const displayValue =
              typeof value === "number" ? value.toFixed(2) : value;

            return (
              <div
                key={key}
                className="border-b border-gray-200 py-2 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm capitalize text-gray-700">
                    {label}
                  </span>
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
                        <p>User-defined risk parameter.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="mt-1 text-sm font-medium text-zinc-800">
                  <span>{displayValue}</span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-500">
            No custom risk parameters defined.
          </p>
        )}
      </div>
    </div>
  );
}
