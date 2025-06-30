"use client";

import { ChatSection } from "@/components/new-application/ui/chat-section";
import { AnalyticsSidebar } from "@/components/new-application/ui/analytics-sidebar";
import { CreditSidebar } from "@/components/new-application/ui/credit-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";

export type ActiveView = "credit-application" | "macroeconomics";

export default function CreditChat() {
  const [activeView, setActiveView] =
    useState<ActiveView>("credit-application");

  return (
    <div className="bg-gray-200 h-screen">
      <SidebarProvider>
        <div className="flex h-full">
          <CreditSidebar />
          <ChatSection activeView={activeView} setActiveView={setActiveView} />
          <AnalyticsSidebar activeView={activeView} />
        </div>
      </SidebarProvider>
    </div>
  );
}
