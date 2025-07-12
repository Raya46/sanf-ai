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
  LogOut,
  ChevronLeft,
  CheckCircle2,
  FileText,
  ScanLine,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { logout } from "@/app/auth/actions";
import { useState, useEffect } from "react";

import { type CreditApplication } from "@/lib/types";

// Tipe data untuk langkah-langkah CoT
interface CoTStep {
  title: string;
  description: string;
  details?: string[];
  status: "pending" | "processing" | "completed";
}

// Komponen baru untuk merender setiap langkah CoT
function ChainOfThoughtStep({ step }: { step: CoTStep }) {
  const [visibleDetails, setVisibleDetails] = useState<string[]>([]);

  // Efek untuk menampilkan detail file satu per satu
  useEffect(() => {
    if (
      step.status === "completed" &&
      Array.isArray(step.details) &&
      step.details.length > 0
    ) {
      setVisibleDetails([]); // Reset dulu
      let detailIndex = 0;
      const interval = setInterval(() => {
        if (Array.isArray(step.details) && detailIndex < step.details.length) {
          setVisibleDetails((prev) => [
            ...prev,
            Array.isArray(step.details) ? step.details[detailIndex] : "",
          ]);
          detailIndex++;
        } else {
          clearInterval(interval);
        }
      }, 200); // Tampilkan file baru setiap 200ms
      return () => clearInterval(interval); // Cleanup
    }
  }, [step.status, step.details]);

  return (
    <div className="flex items-start gap-4">
      <div>
        {step.status === "processing" && (
          <LoaderCircle className="h-5 w-5 animate-spin text-blue-500" />
        )}
        {step.status === "completed" && (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        )}
        {step.status === "pending" && (
          <FileText className="h-5 w-5 text-gray-400" />
        )}
      </div>
      <div className="flex-1">
        <p
          className={`font-semibold transition-colors ${
            step.status !== "pending" ? "text-gray-800" : "text-gray-500"
          }`}
        >
          {step.title}
        </p>
        <p
          className={`text-sm transition-colors ${
            step.status !== "pending" ? "text-gray-600" : "text-gray-400"
          }`}
        >
          {step.description}
        </p>
        {/* Render detail dari state `visibleDetails` */}
        {step.details && (
          <ul className="mt-1 list-disc pl-5 text-xs text-gray-500">
            {visibleDetails.map((detail, i) => (
              <li key={i}>{detail}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function DashboardHeader() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [companyName, setCompanyName] = useState("Company");
  const [applicationFiles, setApplicationFiles] = useState<
    CreditApplication["application_files"]
  >([]);

  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [cotSteps, setCotSteps] = useState<CoTStep[]>([]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const navigateToCreditAnalystAI = () => {
    router.push(`/dashboard/${params.projectId}/chat/${params.applicationId}`);
  };

  // Function to capitalize the first letter of each word
  const capitalizeEachWord = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Fetch application data
  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/applications/${projectId}`);
        if (!response.ok) {
          if (response.status === 401) {
            return router.push("/login");
          }
          throw new Error(`Error: ${response.status}`);
        }
        const data: CreditApplication = await response.json();
        if (data.company_name) {
          setCompanyName(capitalizeEachWord(data.company_name));
        } else if (data.company_type) {
          setCompanyName(capitalizeEachWord(data.company_type));
        }
        if (data.application_files) {
          setApplicationFiles(data.application_files);
        }
      } catch (err) {
        console.error("Failed to fetch application data:", err);
      }
    };
    fetchData();
  }, [projectId, router]);

  // PERBAIKAN: Logika animasi untuk menampilkan langkah satu per satu
  useEffect(() => {
    if (!isLoadingPdf) return;

    const documentList =
      applicationFiles.length > 0
        ? applicationFiles.map((file) => file.file_name)
        : ["Tidak ada dokumen terdeteksi."];

    const allSteps: CoTStep[] = [
      {
        title: "Memulai Analisis",
        description: "Menilai kelayakan kredit...",
        status: "pending",
      },
      {
        title: "Memahami Dokumen",
        description: "Membaca semua dokumen input.",
        details: documentList,
        status: "pending",
      },
      {
        title: "Analisis Profil Perusahaan",
        description: "Mengevaluasi informasi dasar, kepemilikan, dan pasar.",
        status: "pending",
      },
      {
        title: "Verifikasi Legalitas",
        description: "Memeriksa Akta Pendirian, NIB, dan struktur perusahaan.",
        status: "pending",
      },
      {
        title: "Analisis Performa Keuangan",
        description:
          "Menganalisis Laporan Keuangan (Aset, Liabilitas, Laba Rugi).",
        status: "pending",
      },
      {
        title: "Analisis Arus Kas",
        description: "Memeriksa mutasi pada Rekening Koran 3 bulan terakhir.",
        status: "pending",
      },
      {
        title: "Evaluasi Penjualan & Invoice",
        description: "Memeriksa rekapan sales dan histori pembayaran invoice.",
        status: "pending",
      },
      {
        title: "Penilaian Collateral",
        description: "Menilai nilai jaminan dan validitas dokumen.",
        status: "pending",
      },
      {
        title: "Analisis Komitmen & Kerjasama",
        description: "Mengevaluasi LOI dan potensi proyek masa depan.",
        status: "pending",
      },
      {
        title: "Menyusun Kesimpulan Akhir",
        description: "Merumuskan pro, kontra, dan rekomendasi kredit.",
        status: "pending",
      },
      {
        title: "Finalisasi Laporan",
        description: "Menyiapkan dokumen PDF untuk diunduh.",
        status: "pending",
      },
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < allSteps.length) {
        setCotSteps((prev) => {
          const newSteps = [...prev];
          // Tandai langkah sebelumnya sebagai 'completed'
          if (newSteps.length > 0) {
            newSteps[newSteps.length - 1].status = "completed";
          }
          // Tambahkan langkah baru dengan status 'processing'
          newSteps.push({ ...allSteps[stepIndex], status: "processing" });
          return newSteps;
        });
        stepIndex++;
      } else {
        // Proses selesai
        clearInterval(interval);
        // Tandai langkah terakhir sebagai selesai juga
        setCotSteps((prev) => prev.map((s) => ({ ...s, status: "completed" })));
        setTimeout(() => {
          setIsLoadingPdf(false);
          router.push(`/dashboard/${params.projectId}/pdf`);
        }, 2000);
      }
    }, 1500); // Durasi per langkah utama

    return () => clearInterval(interval);
  }, [
    isLoadingPdf,
    applicationFiles,
    params.projectId,
    params.applicationId,
    router,
  ]);

  const handleDownloadPdf = () => {
    setCotSteps([]); // Reset state setiap kali tombol ditekan
    setIsLoadingPdf(true); // Memicu useEffect untuk memulai animasi
  };

  return (
    <header className="flex items-center sticky top-0 z-50 justify-between border-gray-200 bg-[#182d7c] p-4 py-8">
      <div className="flex items-center gap-4">
        <Button
          className="bg-white hover:bg-gray-200"
          onClick={() => router.back()}
        >
          <ChevronLeft className="text-black" />
        </Button>
        <h1 className="font-sans text-4xl font-bold text-white">
          Analisis {companyName}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={handleDownloadPdf}
          variant="ring"
          className="bg-white text-black"
        >
          <Sparkles className="mr-2 h-4 w-4" />
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
          className="bg-white text-black hover:bg-gray-200"
          onClick={handleDownloadPdf}
        >
          <Download className="h-4 w-4" />
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
            <div className="mt-4 flex max-h-[60vh] flex-col gap-4 overflow-y-auto rounded-md bg-slate-50 p-4">
              {cotSteps.map((step, index) => (
                <ChainOfThoughtStep key={index} step={step} />
              ))}
            </div>
          </DialogContent>
        </Dialog>
        <Button
          size="icon"
          variant="ghost"
          className="bg-white text-black hover:bg-gray-200"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
