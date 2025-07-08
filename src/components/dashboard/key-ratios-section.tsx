import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Drawer } from "vaul";
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState<string | null>(null);

  const handleRatioClick = (ratio: string) => {
    setSelectedRatio(ratio);
    setIsOpen(true);
  };

  const currentRatioData = selectedRatio ? ratioData[selectedRatio] : null;
  const maxValue = currentRatioData
    ? Math.max(currentRatioData.average, currentRatioData.applicant) * 1.2
    : 1; // Add some buffer

  return (
    <Drawer.Root direction="right" open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-blue-600 mb-4">Key Ratios</h3>
        <div className="space-y-3">
          {ratios.map((ratio) => (
            <Drawer.Trigger asChild key={ratio}>
              <div
                onClick={() => handleRatioClick(ratio)}
                className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
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
            </Drawer.Trigger>
          ))}
        </div>
      </div>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content
          className="right-2 top-2 bottom-2 fixed z-10 outline-none w-[310px] flex flex-col rounded-[16px] bg-white p-5"
          style={{ "--initial-transform": "calc(100% + 8px)" } as React.CSSProperties}
        >
          <div className="flex flex-col h-full">
            <Drawer.Title className="font-medium mb-4 text-zinc-900">
              {selectedRatio} Comparison
            </Drawer.Title>
            {currentRatioData ? (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-zinc-600 mb-2">Average Value</p>
                  <CategoryBar
                    values={[currentRatioData.average]}
                    marker={{ value: currentRatioData.average, tooltip: `Average: ${currentRatioData.average}` }}
                    colors={["blue"]}
                    className="mx-auto max-w-sm"
                    showLabels={false}
                  />
                  <p className="text-right text-sm text-zinc-600 mt-1">{currentRatioData.average}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-600 mb-2">Credit Applicant Value</p>
                  <CategoryBar
                    values={[currentRatioData.applicant]}
                    marker={{ value: currentRatioData.applicant, tooltip: `Applicant: ${currentRatioData.applicant}` }}
                    colors={["pink"]}
                    className="mx-auto max-w-sm"
                    showLabels={false}
                  />
                  <p className="text-right text-sm text-zinc-600 mt-1">{currentRatioData.applicant}</p>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-zinc-600 mb-2">Comparison</p>
                  <CategoryBar
                    values={[currentRatioData.average, currentRatioData.applicant]}
                    marker={{ value: currentRatioData.applicant, tooltip: `Applicant: ${currentRatioData.applicant}` }}
                    colors={["blue", "pink"]}
                    className="mx-auto max-w-sm"
                    showLabels={false}
                  />
                  <div className="flex justify-between text-xs text-zinc-600 mt-1">
                    <span>Average: {currentRatioData.average}</span>
                    <span>Applicant: {currentRatioData.applicant}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-zinc-600">Select a ratio to see its comparison.</p>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
