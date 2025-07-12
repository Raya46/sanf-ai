"use client";

import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditApplication } from "@/lib/types";
import {
  BookCheck,
  ChevronLeft,
  FileText,
  LogOut,
  MessageCircle,
  ScanLine,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export function DashboardHeader() {
  const params = useParams();
  const router = useRouter();

  const [companyName, setCompanyName] = useState("Company");
  const [applicationFiles, setApplicationFiles] = useState<
    CreditApplication["application_files"]
  >([]);

  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [showCreditEvaluationDialog, setShowCreditEvaluationDialog] =
    useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const navigateToCreditAnalystAI = () => {
    router.push(`/dashboard/${params.projectId}/chat/${params.projectId}`);
  };

  const handleViewAiAnalysis = () => {
    router.push(`/dashboard/${params.projectId}/pdf`);
  };

  return (
    <header className="flex items-center sticky top-0 z-50 justify-between border-gray-200 bg-[#182d7c] p-4 py-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ring"
          className="bg-white hover:bg-gray-200"
          onClick={() => router.replace("/")}
        >
          <ChevronLeft className="text-black" />
        </Button>
        <h1 className="font-sans text-4xl font-bold text-white">
          Analisis {companyName}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="ring"
          className="bg-white text-black"
          onClick={() => setShowCreditEvaluationDialog(true)}
        >
          <FileText className="mr-1 h-4 w-4" />
          Credit Approval Evaluation
        </Button>
        <Button
          variant="ring"
          className="bg-white text-black"
          onClick={() => router.push(`/dashboard/${params.projectId}/pdf`)}
        >
          <BookCheck className="mr-1 h-4 w-4" />
          Credit Approval Recommendation
        </Button>
        <Dialog open={isLoadingPdf} onOpenChange={setIsLoadingPdf}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ScanLine className="h-5 w-5 text-blue-500" />
                Processing File
              </DialogTitle>
              <DialogDescription>
                AI sedang menganalisis dokumen Anda secara bertahap.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog
          open={showCreditEvaluationDialog}
          onOpenChange={setShowCreditEvaluationDialog}
        >
          <DialogContent className="sm:max-w-[900px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Credit Evaluation
              </DialogTitle>
              <DialogDescription>
                Detailed evaluation of the credit application.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 p-4 border rounded-md bg-gray-50 text-sm text-gray-700 whitespace-pre-wrap">
                <h3 className="font-semibold text-lg mb-2">Aspek Positif:</h3>
                <p>
                  Perusahaan memiliki kinerja keuangan yang kuat dengan
                  pertumbuhan pendapatan 25.9% dan laba
                </p>
                <p>39.7%</p>
                <p>
                  Kapasitas pembayaran sangat memadai dengan DSCR 2.1x dan ICR
                  5.79x
                </p>
                <p>
                  Coverage ratio jaminan yang tinggi (265%) dengan aset bernilai
                  tinggi
                </p>
                <p>Track record dan manajemen perusahaan yang profesional</p>
                <p>
                  Prospek industri batu bara yang stabil dengan tren harga
                  positif
                </p>
                <p className="mb-4">
                  Kontrak jangka panjang dengan pelanggan utama menjamin
                  pendapatan
                </p>

                <h3 className="font-semibold text-lg mb-2">
                  Risiko & Mitigasi:
                </h3>
                <p>
                  Risiko fluktuasi harga komoditas – Mitigasi: Kontrak jangka
                  panjang dengan harga minimum
                </p>
                <p>
                  Risiko regulasi pertambangan – Mitigasi: Perusahaan telah
                  memiliki izin lengkap dan memenuhi DMO
                </p>
                <p>
                  Risiko operasional – Mitigasi: Asuransi comprehensive untuk
                  alat berat dan operasional
                </p>
              </div>
              <div className="w-full md:w-1/3 flex items-center justify-center p-4 border rounded-md bg-green-50 text-green-800 font-bold text-2xl">
                <div className="text-center">
                  <p className="text-6xl">89%</p>
                  <p className="text-xl mt-2">Approval Rate</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowCreditEvaluationDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button
          variant="ring"
          className="bg-white text-black"
          onClick={navigateToCreditAnalystAI}
        >
          <MessageCircle className="mr-1 h-4 w-4" />
          Chat with Assistant
        </Button>
        <Button
          size="icon"
          variant="ring"
          className="bg-white text-black hover:bg-gray-200"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
