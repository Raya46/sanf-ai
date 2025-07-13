"use client";

import { CreditAnalysisCard } from "@/components/new-application/ui/credit-analysis-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Clock,
  Download,
  File,
  Flag,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PdfExportModal } from "./pdf-export-modal";

import { CreditApplication } from "@/lib/types";
import { useRouter } from "next/navigation";

interface AnalyticsSidebarProps {
  activeView: "credit-application" | "macroeconomics";
  applicationId?: string;
}

export function AnalyticsSidebar({
  activeView,
  applicationId,
}: AnalyticsSidebarProps) {
  const [applicationData, setApplicationData] =
    useState<CreditApplication | null>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!applicationId) {
      setIsAppLoading(false);
      return;
    }
    const fetchApplicationData = async () => {
      setIsAppLoading(true);
      try {
        const response = await fetch(`/api/applications/${applicationId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch application data");
        }
        const data = (await response.json()) as CreditApplication;
        setApplicationData(data);
      } catch (error) {
        console.error(error);
        setApplicationData(null);
      } finally {
        setIsAppLoading(false);
      }
    };
    fetchApplicationData();
  }, [applicationId]);

  return (
    <>
      <div className="sticky top-4 flex flex-col w-1/4 bg-white rounded-lg shadow-lg h-full overflow-y-auto">
        <h1 className="text-center font-bold my-4">Analytics & Status</h1>
        <div className="mx-4 mb-2">
          <Separator />
        </div>
        <div className="flex flex-col p-4 gap-4">
          <div className="grid grid-cols-2 gap-2">
            {/* Persistent Application Cards */}
            {isAppLoading ? (
              <>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </>
            ) : applicationData ? (
              <>
                <CreditAnalysisCard
                  icon={<CheckCircle2 className="w-8 h-8" />}
                  title={`${applicationData.probability_approval}%`}
                  description="Probabilitas Persetujuan"
                  bgColor="transparent"
                  iconColor="#007BFF"
                />
                <CreditAnalysisCard
                  icon={<TriangleAlert className="w-8 h-8" />}
                  title={applicationData.overall_indicator}
                  description="Indikator Risiko"
                  bgColor="transparent"
                  iconColor="#FF9800"
                />
              </>
            ) : (
              <p className="col-span-2 text-center text-gray-500">
                Data aplikasi tidak ditemukan.
              </p>
            )}

            {/* View-specific cards */}
            {activeView === "credit-application" && (
              <>
                {isAppLoading ? (
                  <>
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </>
                ) : applicationData ? (
                  <>
                    <CreditAnalysisCard
                      icon={<Clock className="w-8 h-8" />}
                      title={`${applicationData.document_validation_percentage}%`}
                      description="Progress Validasi Dokumen"
                      bgColor="transparent"
                      iconColor="#007BFF"
                    />
                    <CreditAnalysisCard
                      icon={<Flag className="w-8 h-8" />}
                      title={`${applicationData.estimated_analysis_time_minutes} Menit`}
                      description="Estimasi Waktu Analisis"
                      bgColor="transparent"
                      iconColor="#007BFF"
                    />
                  </>
                ) : null}
              </>
            )}
          </div>

          {activeView === "credit-application" && (
            <div className="flex flex-col gap-4">
              <Button
                className="bg-blue-600 flex flex-row mx-4"
                onClick={() => setIsModalOpen(true)}
                disabled={!applicationData}
              >
                <Download className="w-4 h-4" />
                <span>Rangkum Percakapan</span>
              </Button>
              <Button
                className="mx-4"
                onClick={() => router.push(`/dashboard/${applicationId}`)}
              >
                <span>Dashboard</span>
              </Button>
            </div>
          )}
        </div>
      </div>
      <PdfExportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        applicationData={applicationData}
      />
    </>
  );
}
