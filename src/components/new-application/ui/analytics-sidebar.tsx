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
  AreaChart,
  Landmark,
  TrendingUp,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SidebarIndicator {
  name: string;
  value: string;
}

interface AnalyticsSidebarProps {
  activeView: "credit-application" | "macroeconomics";
}

const indicatorIcons: { [key: string]: React.ReactNode } = {
  "Inflation Rate": <TrendingUp className="w-8 h-8" />,
  "Interest Rate": <Landmark className="w-8 h-8" />,
  "GDP Growth Rate": <AreaChart className="w-8 h-8" />,
  "Unemployment Rate": <UserX className="w-8 h-8" />,
};

export function AnalyticsSidebar({ activeView }: AnalyticsSidebarProps) {
  const [sidebarData, setSidebarData] = useState<SidebarIndicator[]>([]);

  useEffect(() => {
    const fetchSidebarData = async () => {
      if (activeView === "macroeconomics") {
        try {
          const response = await fetch("/api/macroeconomics");
          if (!response.ok) {
            throw new Error("Failed to fetch sidebar data");
          }
          const data = (await response.json()) as {
            sidebarIndicators: SidebarIndicator[];
          };
          setSidebarData(data.sidebarIndicators);
        } catch (error) {
          console.error(error);
          // Handle error state if needed
        }
      }
    };

    fetchSidebarData();
  }, [activeView]);

  return (
    <div className="sticky top-4 flex flex-col w-1/4 bg-white rounded-lg shadow-lg mr-4 p h-[calc(100vh-2rem)] overflow-y-auto">
      <h1 className="text-center font-bold my-4">Analytics & Status</h1>
      <div className="mx-4 mb-2">
        <Separator />
      </div>
      <div className="flex flex-col p-4 gap-4">
        {activeView === "credit-application" ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <CreditAnalysisCard
                icon={<CheckCircle2 className="w-8 h-8" />}
                title="85%"
                description="Probabilitas Persetujuan"
                bgColor="transparent"
                iconColor="#007BFF"
              />
              <CreditAnalysisCard
                icon={<TriangleAlert className="w-8 h-8" />}
                title="Sedang"
                description="Indikator Risiko"
                bgColor="transparent"
                iconColor="#FF9800"
              />
              <CreditAnalysisCard
                icon={<Clock className="w-8 h-8" />}
                title="90%"
                description="Progress Validasi Dokumen"
                bgColor="transparent"
                iconColor="#007BFF"
              />
              <CreditAnalysisCard
                icon={<Flag className="w-8 h-8" />}
                title="15 Menit"
                description="Estimasi Waktu Analisis"
                bgColor="transparent"
                iconColor="#007BFF"
              />
            </div>
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
          </>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <CreditAnalysisCard
              icon={<CheckCircle2 className="w-8 h-8" />}
              title="85%"
              description="Probabilitas Persetujuan"
              bgColor="transparent"
              iconColor="#007BFF"
            />
            <CreditAnalysisCard
              icon={<TriangleAlert className="w-8 h-8" />}
              title="Sedang"
              description="Indikator Risiko"
              bgColor="transparent"
              iconColor="#FF9800"
            />
            {sidebarData.map((indicator) => (
              <CreditAnalysisCard
                key={indicator.name}
                icon={
                  indicatorIcons[indicator.name] || (
                    <AreaChart className="w-8 h-8" />
                  )
                }
                title={indicator.value}
                description={indicator.name}
                bgColor="transparent"
                iconColor="#007BFF"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
