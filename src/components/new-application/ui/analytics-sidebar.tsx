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

export function AnalyticsSidebar() {
  return (
    <div className="sticky top-4 flex flex-col w-1/4 bg-white rounded-lg shadow-lg mr-4 p h-[calc(100vh-2rem)] overflow-y-auto">
      <h1 className="text-center font-bold my-4">Analytics & Status</h1>
      <div className="mx-4 mb-2">
        <Separator />
      </div>
      <div className="flex flex-col p-4 gap-4">
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
      </div>
    </div>
  );
}
