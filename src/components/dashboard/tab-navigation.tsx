"use client";

import { Button } from "@/components/ui/button";

const tabs = [
  { id: "income-statements", label: "INCOME STATEMENTS" },
  { id: "balance-sheet", label: "BALANCE SHEET" },
  { id: "cash-flow", label: "CASH FLOW" },
  { id: "ratios", label: "RATIOS" },
  { id: "industry-data", label: "INDUSTRY DATA" },
];

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex bg-white rounded-t-lg overflow-hidden relative z-10 w-fit text-sm border-b border-gray-200">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          size="sm"
          onClick={() => onTabChange(tab.id)}
          className={`relative z-10 px-4 py-2 uppercase font-medium transition-all duration-200
            ${activeTab === tab.id
              ? "bg-white text-purple-600 rounded-t-lg -mb-px border-t border-l border-r border-gray-200" // Active tab
              : "text-gray-600 hover:text-purple-600 -mb-px"
            }
            ${tab.id === "income-statements" ? "rounded-tl-lg" : ""}
          `}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
