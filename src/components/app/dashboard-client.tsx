"use client";

import { ChartArea } from "@/components/app/chart-area";
import { DataTable } from "@/components/app/data-table";
import { SectionCardDashboard } from "@/components/app/section-card-dashboard";
import { SectionCardStatus } from "@/components/app/section-card-status";
import * as React from "react";

export function DashboardClient() {
  const [selectedSection, setSelectedSection] = React.useState("credit");

  return (
    <>
      <SectionCardDashboard />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col mx-4">
          <div className="flex flex-col lg:flex-row w-full gap-4 mt-4">
            <div className="flex flex-col gap-4 w-full lg:w-2/3">
              <ChartArea
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
              />
              <DataTable selectedSection={selectedSection} />
            </div>
            <div className="flex flex-col w-full lg:w-1/3">
              <SectionCardStatus />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
