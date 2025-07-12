"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TabNavigation } from "@/components/dashboard/tab-navigation";
import { MetricTrendCard } from "@/components/dashboard/metric-trend-card";
import { CombinedMetricsCard } from "@/components/dashboard/combined-metrics-card";
import { KeyRatiosSection } from "@/components/dashboard/key-ratios-section";
import { MainChart } from "@/components/dashboard/main-chart";
import { CreditRadarChart } from "@/components/dashboard/credit-radar-chart";
import { FraudDonutChart } from "@/components/dashboard/fraud-donut-chart";
import { BalanceSheetTab } from "@/components/dashboard/balance-sheet-tab";
import { CashFlowTab } from "@/components/dashboard/cash-flow-tab";
import { RatioTab } from "@/components/dashboard/ratio-tab";
import { IndustryDataTab } from "@/components/dashboard/industry-data-tab";
import { IncomeStatementTab } from "./income-statement-tab";
import { type CreditApplication } from "@/lib/types";

const tabs = [
  { id: "income-statements", label: "RINGKASAN PERTUMBUHAN" },
  { id: "balance-sheet", label: "NERACA" },
  { id: "cash-flow", label: "ARUS KAS" },
  { id: "ratios", label: "RASIO" },
  { id: "profitability", label: "LABA RUGI" },
  { id: "industry-data", label: "DATA LAINNYA" },
];

function parseToUnit(amount: number): string {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "Rp 0";
  }
  if (amount >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(2)} Miliar`;
  }
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(2)} Juta`;
  }
  return `Rp ${new Intl.NumberFormat("id-ID").format(amount)}`;
}

// Calculate CAGR (Compound Annual Growth Rate)
function calculateCAGR(
  revenueArr: { year?: number; revenue: number }[]
): number | null {
  if (!revenueArr || revenueArr.length < 2) return null;
  const sorted = [...revenueArr].sort((a, b) => {
    if (a.year !== undefined && b.year !== undefined) return a.year - b.year;
    return 0;
  });
  const start = sorted[0].revenue;
  const end = sorted[sorted.length - 1].revenue;
  const periods = sorted.length - 1;
  if (start <= 0 || end <= 0 || periods <= 0) return null;
  const cagr = Math.pow(end / start, 1 / periods) - 1;
  return cagr * 100;
}

export function FinancialDashboard({
  applicationData,
  isLoading = false,
}: {
  applicationData: CreditApplication;
  isLoading?: boolean;
}) {
  const revenueArr = applicationData.revenue || [];
  const totalRevenue =
    revenueArr.reduce((sum, item) => sum + item.revenue, 0) || 0;
  const cagr = calculateCAGR(revenueArr);

  const mainMetrics = [
    {
      label: "Pertumbuhan Pendapatan",
      value: isLoading ? "" : "25.9%",
      subtitle: isLoading ? "" : "Rp 62.98 M → Rp 79.26 M",
      hasInfo: true,
      trend: "positive",
    } as const,
    {
      label: "Pertumbuhan Laba",
      value: isLoading ? "" : "39.7%",
      subtitle: isLoading ? "" : "Rp 12.94 M → Rp 18.08 M",
      hasInfo: true,
      trend: "positive",
    } as const,
    {
      label: "Pertumbuhan Aset",
      value: isLoading ? "" : "20.0%",
      subtitle: isLoading ? "" : "Rp 146.12 M → Rp 175.30 M",
      hasInfo: true,
      trend: "positive",
    } as const,
  ];

  const performanceCards = [
    {
      title: "Jumlah Ekuitas",
      value: isLoading
        ? ""
        : parseToUnit((applicationData as any).equity || 175300000000),
      delta: isLoading
        ? ""
        : cagr !== null
          ? `+${cagr.toFixed(2)}% CAGR`
          : "+20.0%",
      deltaType: "positive" as const,
      trend: "up" as const,
    },
    {
      title: "Jumlah Liabilitas",
      value: isLoading
        ? ""
        : parseToUnit((applicationData as any).liabilities || 146120000000),
      delta: isLoading ? "" : "-6.9% CAGR",
      deltaType: "negative" as const,
      trend: "down" as const,
    },
  ];

  const [activeTab, setActiveTab] = useState("income-statements");

  const currentTabLabel =
    tabs.find((tab) => tab.id === activeTab)?.label || "Dashboard";

  // Conditional rendering for tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "balance-sheet":
        return (
          <div className="flex flex-col gap-6 px-6">
            <BalanceSheetTab />
          </div>
        );
      case "cash-flow":
        return (
          <div className="flex flex-col gap-6 px-6">
            <CashFlowTab />
          </div>
        );
      case "ratios":
        return (
          <div className="flex flex-col gap-6 px-6 pb-6">
            <RatioTab />
          </div>
        );
      case "profitability":
        return (
          <div className="flex flex-col gap-6 px-6 pb-6">
            <IncomeStatementTab />
          </div>
        );
      case "industry-data":
        return (
          <div className="flex flex-col gap-6 px-6">
            <IndustryDataTab />
          </div>
        );
      case "income-statements":
      default:
        return (
          <>
            {/* Main Metrics Section - Combined Card and Performance Cards */}
            <div className="grid grid-cols-1 px-6 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <CombinedMetricsCard
                  metrics={mainMetrics as any}
                  title={currentTabLabel}
                />
              </div>
              <div className="flex flex-col gap-4">
                {performanceCards.map((card) => (
                  <MetricTrendCard
                    key={card.title}
                    title={card.title}
                    value={card.value}
                    delta={card.delta}
                    deltaType={card.deltaType as "positive" | "negative"}
                    trend={card.trend as "up" | "down"}
                  />
                ))}
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-6 px-6 lg:grid-cols-4">
              {/* Left Sidebar */}
              <div>
                <KeyRatiosSection applicationData={applicationData} />
              </div>

              {/* Main Chart */}
              <div className="lg:col-span-2">
                <MainChart chartData={applicationData.analysis_value || []} />
              </div>

              {/* Right Sidebar - Replaced with CreditRadarChart */}
              <div className="flex flex-col gap-6">
                <CreditRadarChart />
                <FraudDonutChart />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <DashboardLayout>
      {/* PERBAIKAN: Mengoper applicationData.application_files sebagai prop */}
      <DashboardHeader />

      <div className="flex-1 space-y-8 bg-indigo-100/50">
        <div className="px-6 pt-12">
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />
        </div>
        {renderTabContent()}
      </div>
    </DashboardLayout>
  );
}
