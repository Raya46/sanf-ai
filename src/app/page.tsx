"use client";

import { SiteHeader } from "@/components/app/app-header";
import { AppSidebar } from "@/components/app/app-sidebar";
import { ChartArea } from "@/components/app/chart-area";
import { DataTable } from "@/components/app/data-table";
import { SectionCardDashboard } from "@/components/app/section-card-dashboard";
import { SectionCardStatus } from "@/components/app/section-card-status";
import { SidebarInset } from "@/components/ui/sidebar";
import * as React from "react";

export default function Home() {
  const [selectedSection, setSelectedSection] = React.useState("credit");

  return (
    <>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <SectionCardDashboard />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col mx-4">
            <div className="flex flex-row w-full gap-4 mt-4">
              <div className="flex flex-col gap-4 w-[1100px]">
                <ChartArea
                  selectedSection={selectedSection}
                  setSelectedSection={setSelectedSection}
                />
                <DataTable selectedSection={selectedSection} />
              </div>
              <div className="flex flex-col w-[551px]">
                <SectionCardStatus />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
