import { ChatCard } from "@/components/new-application/ui/chat-card";
import { CreditAnalysisCard } from "@/components/new-application/ui/credit-analysis-card";
import { CreditSidebar } from "@/components/new-application/ui/credit-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  CheckCircle2,
  Clock,
  Download,
  File,
  Flag,
  Send,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";

export default function CreditChat() {
  return (
    <SidebarProvider>
      <CreditSidebar />
      <div className="flex flex-col w-3/4 bg-gray-100 gap-3 mx-2 p-4">
        <h1>Credit Application Overview</h1>
        <ChatCard
          color="#E0F7FA"
          position="start"
          chat="Berdasarkan dokumen yang disediakan, aplikasi kredit ini terkait
            dengan PT Maju Bersama. Laporan keuangan menunjukkan kesehatan
            finansial yang stabil selama 2 tahun terakhir, dengan pertumbuhan
            pendapatan yang konsisten. Rekening koran 3 bulan mengkonfirmasi
            likuiditas yang kuat."
          sources="Sources: Laporan_Keuangan_2_Tahun.pdf, Rekening_Koran_3_Bulan.pdf"
        />
        <ChatCard
          color="#007BFF"
          position="end"
          chat="Bisakah Anda merangkum poin-poin risiko utama dari aplikasi ini?"
        />
        <div className="flex items-center gap-2 mt-auto">
          <Input placeholder="Ketik pesan Anda..." className="flex-grow" />
          <Button className="bg-blue-600">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col w-1/4">
        <h1 className="text-center font-bold my-4">Analytics & Status</h1>
        <div className="mx-4 mb-2">
          <Separator />
        </div>
        <div className="flex flex-col gap-4">
          <CreditAnalysisCard
            icon={<CheckCircle2 className="w-10 h-10" />}
            title="85%"
            description="Probabilitas Persetujuan"
            bgColor="#E0F7FA"
            iconColor="#007BFF"
          />
          <CreditAnalysisCard
            icon={<TriangleAlert className="w-10 h-10" />}
            title="Sedang"
            description="Indikator Risiko Keseluruhan"
            bgColor="#FFF3E0"
            iconColor="#FF9800"
          />
          <CreditAnalysisCard
            icon={<Clock className="w-10 h-10" />}
            title="90%"
            description="Progress Validasi Dokumen"
            bgColor="#E0F7FA"
            iconColor="#007BFF"
          />
          <CreditAnalysisCard
            icon={<Flag className="w-10 h-10" />}
            title="15 Menit"
            description="Estimasi Waktu Analisis"
            bgColor="#E0F7FA"
            iconColor="#007BFF"
          />
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
    </SidebarProvider>
  );
}
