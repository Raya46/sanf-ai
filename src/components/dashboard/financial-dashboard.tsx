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
import { type CreditApplication } from "@/lib/types";

const tabs = [
  { id: "income-statements", label: "INCOME STATEMENTS" },
  { id: "balance-sheet", label: "BALANCE SHEET" },
  { id: "cash-flow", label: "CASH FLOW" },
  { id: "ratios", label: "RATIOS" },
  { id: "industry-data", label: "INDUSTRY DATA" },
];

const formatToRupiah = (amount: number) => {
  return `Rp ${new Intl.NumberFormat("id-ID").format(amount)}`;
};

export function FinancialDashboard({
  applicationData,
}: {
  applicationData: CreditApplication;
}) {
  const mainMetrics = [
    {
      label: "Total Revenue",
      value: formatToRupiah(
        applicationData.revenue.reduce((sum, item) => sum + item.revenue, 0) ||
          0
      ),
      hasInfo: true,
      trend: "negative" as const,
    },
    {
      label: "Gross Profit",
      value: formatToRupiah(applicationData.gross_profit), // Example calculation
      hasInfo: true,
      trend: "positive" as const,
    },
    {
      label: "Operating Expenses",
      value: formatToRupiah(applicationData.operating_expenses), // Example calculation
      hasInfo: true,
      trend: "positive" as const,
    },
  ];

  const performanceCards = [
    {
      title: "Total Revenue",
      value: formatToRupiah(
        applicationData.revenue.reduce((sum, item) => sum + item.revenue, 0) ||
          0
      ),
      delta: "+21.6%", // Placeholder
      deltaType: "positive" as const,
      trend: "up" as const,
    },
    {
      title: "EBITDA",
      value: formatToRupiah(applicationData.ebitda), // Example calculation
      delta: "-6.9%", // Placeholder
      deltaType: "negative" as const,
      trend: "down" as const,
    },
  ];

  const [activeTab, setActiveTab] = useState("income-statements");

  const currentTabLabel =
    tabs.find((tab) => tab.id === activeTab)?.label || "Dashboard";

  return (
    <DashboardLayout>
      <DashboardHeader />

      <div className="flex-1 bg-indigo-100/50 space-y-8">
        {/* Main Metrics Section - Combined Card and Performance Cards */}
        <div className="px-6 pt-12">
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CombinedMetricsCard
                metrics={mainMetrics}
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
                  deltaType={card.deltaType}
                  trend={card.trend}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="px-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div>
            <KeyRatiosSection applicationData={applicationData} />
          </div>

          {/* Main Chart */}
          <div className="lg:col-span-2">
            <MainChart
              period={activeTab}
              onPeriodChange={setActiveTab}
              revenueData={applicationData.revenue}
            />
            {/* Using activeTab for period */}
          </div>

          {/* Right Sidebar - Replaced with CreditRadarChart */}
          <div className="flex flex-col gap-6">
            <CreditRadarChart />
            <FraudDonutChart />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
