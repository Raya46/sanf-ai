"use client";

import { FinancialDashboard } from "@/components/dashboard/financial-dashboard";
import { redirect, useParams } from "next/navigation";
import { type CreditApplication } from "@/lib/types";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [applicationData, setApplicationData] =
    useState<CreditApplication | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorData, setErrorData] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) return;
    const fetchData = async () => {
      setIsLoadingData(true);
      setErrorData(null);
      try {
        const response = await fetch(`/api/applications/${projectId}`);
        if (!response.ok) {
          if (response.status === 401) {
            return redirect("/login");
          }
          throw new Error(`Error: ${response.status}`);
        }
        const data: CreditApplication = await response.json();
        setApplicationData(data);
      } catch (err) {
        setErrorData(err as Error);
        console.error("Failed to fetch application data:", err);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, [projectId]);

  if (isLoadingData) {
    return <div>Loading application data...</div>;
  }

  if (errorData) {
    return <div>Error loading application data.</div>;
  }

  if (!applicationData) {
    return <div>No application data found.</div>;
  }

  return <FinancialDashboard applicationData={applicationData} />;
}
