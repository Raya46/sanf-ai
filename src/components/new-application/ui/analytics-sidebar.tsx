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
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ApplicationData {
  probability_approval: number;
  overall_indicator: string;
  document_validation_percentage: number;
  estimated_analysis_time_minutes: number;
}

interface AnalyticsSidebarProps {
  activeView: "credit-application" | "macroeconomics";
  applicationId?: string;
}

export function AnalyticsSidebar({
  activeView,
  applicationId,
}: AnalyticsSidebarProps) {
  const [applicationData, setApplicationData] =
    useState<ApplicationData | null>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);

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
        const data = (await response.json()) as ApplicationData;
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
    <div className="sticky top-4 flex flex-col w-1/4 bg-white rounded-lg shadow-lg mr-4 p h-[calc(100vh-2rem)] overflow-y-auto">
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
            <p>Tautan Cepat</p>
            <div className="flex flex-row items-center gap-2">
              <File className="w-4 h-4" />
              <p>Lihat Laporan Lengkap</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <File className="w-4 h-4" />
              <p>Lihat Laporan Lengkap</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <File className="w-4 h-4" />
              <p>Lihat Laporan Lengkap</p>
            </div>
            <Button className="bg-blue-600 flex flex-row mx-4 mb-4">
              <Download className="w-4 h-4" />
              <Link href="/">Ekspor PDF</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
