"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  LoaderCircle,
  Sparkles,
  Download,
  User,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { logout } from "@/app/auth/actions";
import { useState } from "react";

export function DashboardHeader() {
  const params = useParams();
  const router = useRouter();
  const placeholderApplicationId = "a9fcc6e8-64c7-4968-b9ce-f8f26ae14d64";
  const placeholderProjectId = "1"; // Assuming a placeholder project ID

  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "AI sedang menyiapkan PDF..."
  );

  const handleLogout = async () => {
    await logout();
  };

  const navigateToCreditAnalystAI = () => {
    router.push(`/dashboard/${placeholderProjectId}/chat/${params.projectId}`);
  };

  const handleDownloadPdf = () => {
    setIsLoadingPdf(true);
    setLoadingMessage("AI sedang menyiapkan PDF...");
    // Simulasi animasi loading AI
    let step = 0;
    const messages = [
      "AI sedang menyiapkan PDF...",
      "Mengumpulkan data dokumen...",
      "Menganalisis data keuangan...",
      "Membuat file PDF...",
      "Finalisasi PDF...",
    ];
    const interval = setInterval(() => {
      setLoadingMessage(messages[step % messages.length]);
      step++;
    }, 1200);
    setTimeout(() => {
      clearInterval(interval);
      setIsLoadingPdf(false);
      router.push(`/dashboard/${params.projectId}/pdf`);
    }, 4200);
  };

  return (
    <header className="flex justify-between items-center p-4 py-8 bg-[#182d7c] border-gray-200">
      <div className="flex items-center gap-4">
        <Button
          className="bg-white hover:bg-sanf-secondary"
          onClick={() => router.push("/")}
        >
          <ChevronLeft className="text-black" />
        </Button>
        <h1 className="text-4xl font-sans font-bold text-white">
          Financial Analysis Company
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ring" className="bg-white text-black">
          <Sparkles className="w-4 h-4 mr-2" />
          View AI Analysis
        </Button>
        <Button
          variant="ring"
          className="bg-white text-black"
          onClick={navigateToCreditAnalystAI}
        >
          Credit Analyst AI Agent
        </Button>
        <Button
          size="icon"
          className="bg-white hover:bg-sanf-secondary text-black"
          onClick={handleDownloadPdf}
        >
          <Download className="w-4 h-4" />
        </Button>
        <Dialog open={isLoadingPdf}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Generate PDF</DialogTitle>
              <DialogDescription>
                Mohon tunggu, AI sedang memproses dokumen PDF Anda.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-4">
              <LoaderCircle className="animate-spin h-12 w-12 text-blue-500" />
              <p className="text-lg font-medium text-center">
                {loadingMessage}
              </p>
            </div>
          </DialogContent>
        </Dialog>
        <Button
          size="icon"
          variant="ghost"
          className="bg-white hover:bg-sanf-secondary hover:text-black  "
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
