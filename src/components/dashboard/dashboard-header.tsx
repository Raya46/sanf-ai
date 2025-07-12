"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  LoaderCircle,
  Sparkles,
  Bot,
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
  const [showCreditEvaluationDialog, setShowCreditEvaluationDialog] =
    useState(false);

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
          variant="ring"
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
          <Sparkles className="mr-1 h-4 w-4" />
          Download AI Analysis
        </Button>
        {/* Replaced Download button with Credit Analyst AI Agent button that opens dialog */}
        <Button
          variant="ring"
          className="bg-white text-black"
          onClick={() => setShowCreditEvaluationDialog(true)}
        >
          <ScanLine className="mr-1 h-4 w-4" />
          Credit Evaluation
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
        {/* New Dialog for Credit Evaluation */}
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
        {/* Original Credit Analyst AI Agent button, remains as is */}
        <Button
          variant="ring"
          className="bg-white text-black"
          onClick={navigateToCreditAnalystAI}
        >
          <Bot className="mr-1 h-4 w-4" />
          Credit Analyst AI Agent
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
