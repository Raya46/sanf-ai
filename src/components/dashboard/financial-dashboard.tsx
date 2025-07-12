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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Banknote,
  Scale,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  TrendingUp,
} from "lucide-react";
import { BalanceSheetTab } from "@/components/dashboard/balance-sheet-tab";
import { CashFlowTab } from "@/components/dashboard/cash-flow-tab";
import { RatioTab } from "@/components/dashboard/ratio-tab";
import { IndustryDataTab } from "@/components/dashboard/industry-data-tab";
import { IncomeStatementTab } from "./income-statement-tab";
import { type CreditApplication } from "@/lib/types";
import { RiskScoreSummary } from "./risk-score-summary";

const tabs = [
  { id: "income-statements", label: "Ringkasan Analisa" },
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
      subtitle: isLoading ? "" : "Rp 82 M → Rp 92.45 M",
      hasInfo: true,
      trend: "positive",
    } as const,
  ];

  const performanceCards = [
    {
      title: "Jumlah Ekuitas",
      value: isLoading
        ? ""
        : parseToUnit((applicationData as any).equity || 92450000000),
      delta: isLoading ? "" : cagr !== null ? `+18.19% CAGR` : "+20.0%",
      deltaType: "positive" as const,
      trend: "up" as const,
    },
    {
      title: "Jumlah Liabilitas",
      value: isLoading
        ? ""
        : parseToUnit((applicationData as any).liabilities || 82850000000),
      delta: isLoading ? "" : "+22.02% CAGR",
      deltaType: "positive" as const,
      trend: "up" as const,
    },
  ];

  const creditFacilities = [
    {
      bank: "Mandiri",
      type: "KMK",
      plafond: 12000000000,
      outstanding: 9500000000,
      status: "Lancar",
    },
    {
      bank: "BCA",
      type: "KI (Alat Berat)",
      plafond: 6200000000,
      outstanding: 4100000000,
      status: "Lancar",
    },
    {
      bank: "Leasing X",
      type: "Sewa Guna Usaha",
      plafond: 8750000000,
      outstanding: 5300000000,
      status: "Lancar",
    },
  ];

  const financialPerformance = [
    {
      title: "Cash Flow",
      status: "POSITIF",
      detail: "3 Bulan Terakhir",
      icon: TrendingUp,
      trend: "positive",
    },
    {
      title: "Rekening Koran",
      status: "AKTIF",
      detail: "Mutasi Normal",
      icon: CheckCircle,
      trend: "positive",
    },
    {
      title: "Tren Penjualan",
      status: "NAIK",
      detail: "+25.9% YoY",
      icon: ArrowUp,
      trend: "positive",
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
                {/* Fasilitas Kredit Existing Card */}
                <div className="lg:col-span-2 pt-6">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>FASILITAS KREDIT EXISTING</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table className="w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Bank</TableHead>
                            <TableHead>Jenis Fasilitas</TableHead>
                            <TableHead>Plafon</TableHead>
                            <TableHead>Outstanding</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {creditFacilities.map((facility, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {facility.bank}
                              </TableCell>
                              <TableCell>{facility.type}</TableCell>
                              <TableCell>
                                {parseToUnit(facility.plafond)}
                              </TableCell>
                              <TableCell>
                                {parseToUnit(facility.outstanding)}
                              </TableCell>
                              <TableCell>{facility.status}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Main Chart */}
              <div className="lg:col-span-2 pb-6">
                <MainChart chartData={applicationData.analysis_value || []} />
                <div className="p-6 w-full bg-white rounded-lg border-1 mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">
                    PERFORMA KEUANGAN TERKINI
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {financialPerformance.map((item, index) => (
                      <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            {item.title}
                          </CardTitle>
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {item.status}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {item.detail}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Replaced with CreditRadarChart */}
              <div className="flex flex-col gap-6 pb-6">
                <CreditRadarChart />
                <RiskScoreSummary />
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
