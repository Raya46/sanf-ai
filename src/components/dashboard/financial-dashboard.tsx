"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TabNavigation } from "@/components/dashboard/tab-navigation";
import { MetricTrendCard } from "@/components/dashboard/metric-trend-card";
import { CombinedMetricsCard } from "@/components/dashboard/combined-metrics-card";
import { KeyRatiosSection } from "@/components/dashboard/key-ratios-section";
import { MainChart } from "@/components/dashboard/main-chart";
import { ChatSection } from "@/components/new-application/ui/chat-section";
import { type ChatMessage, type CreditApplication } from "@/lib/types";
import { type ActiveView } from "@/app/dashboard/[projectId]/chat/[applicationId]/page";

const mainMetrics = [
  {
    label: "Total Revenue",
    value: "$12,405,134.65",
    hasInfo: true,
    trend: "negative" as const,
  },
  {
    label: "Gross Profit",
    value: "$8,195,001.05",
    hasInfo: true,
    trend: "positive" as const,
  },
  {
    label: "Operating Expenses",
    value: "$2,085,606.14",
    hasInfo: true,
    trend: "positive" as const,
  },
];

const performanceCards = [
  {
    title: "Total Revenue",
    value: "$805,134.65",
    delta: "+21.6%",
    deltaType: "positive" as const,
    trend: "up" as const,
  },
  {
    title: "EBITDA",
    value: "$405,134.65",
    delta: "-6.9%",
    deltaType: "negative" as const,
    trend: "down" as const,
  },
];

// Mock data for ChatSection props
const mockApplicationData: CreditApplication = {
  id: "mock-app-123",
  created_at: new Date().toISOString(),
  user_id: "mock-user-123",
  status: "approved",
  analysis_template: "standard",
  risk_appetite: 70, // Changed to number as per type
  company_type: "Productive", // Added new field
  amount: 1000000, // Added new field
  ai_analysis_status: "completed",
  probability_approval: 80, // Changed to number as per type
  overall_indicator: "MEDIUM_RISK", // Changed to string as per type
  document_validation_percentage: 100,
  estimated_analysis_time_minutes: 5,
  revenue: [
    { year: 2024, month: 1, revenue: 100 },
    { year: 2024, month: 2, revenue: 120 },
    { year: 2024, month: 3, revenue: 110 },
  ],
  application_files: [],
  ai_analysis: "This is a mock AI analysis report.", // Added new field
};

const mockInitialMessages: ChatMessage[] = [
  {
    id: "1",
    sender_type: "ai",
    message_content: "Hello! How can I assist you with this application?",
  },
];

export function FinancialDashboard() {
  const [activeTab, setActiveTab] = useState("income-statements");
  const [activeView, setActiveView] =
    useState<ActiveView>("credit-application");
  const [initialMessages, setInitialMessages] =
    useState<ChatMessage[]>(mockInitialMessages);

  return (
    <DashboardLayout>
      <DashboardHeader />

      <div className="flex-1 p-6 space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Financial Analysis
          </h1>
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Company</h2>
        </div>

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Metrics Section - Combined Card and Performance Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CombinedMetricsCard metrics={mainMetrics} />
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div>
            <KeyRatiosSection />
          </div>

          {/* Main Chart */}
          <div className="lg:col-span-2">
            <MainChart period={activeTab} onPeriodChange={setActiveTab} />{" "}
            {/* Using activeTab for period */}
          </div>

          {/* Right Sidebar - Replaced with ChatSection */}
          <div>
            <ChatSection
              activeView={activeView}
              setActiveView={setActiveView}
              applicationData={mockApplicationData}
              isLoadingData={false} // Mock value
              errorData={null} // Mock value
              initialMessages={initialMessages}
              isLoadingChat={false} // Mock value
              applicationId={mockApplicationData.id}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
