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
        // Add 3 second delay for better skeleton visualization
        await new Promise((resolve) => setTimeout(resolve, 5000));
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

  if (errorData) {
    return <div>Error loading application data.</div>;
  }

  // Kirim empty object sebagai fallback saat loading
  const safeApplicationData: CreditApplication = applicationData || {
    id: "",
    created_at: new Date().toISOString(),
    user_id: "",
    status: "pending",
    company_name: "",
    company_type: "",
    revenue: [],
    gross_profit: 0,
    operating_expenses: 0,
    ebitda: 0,
    analysis_value: [],
    application_files: [],
    risk_parameter: {},
    probability_approval: 0,
    overall_indicator: "",
    analysis_template: "",
    amount: 0,
    ai_analysis_status: "pending",
    document_validation_percentage: 0,
    estimated_analysis_time_minutes: 0,
    ai_analysis: "",
  };

  return (
    <FinancialDashboard
      applicationData={safeApplicationData}
      isLoading={isLoadingData}
    />
  );
}
