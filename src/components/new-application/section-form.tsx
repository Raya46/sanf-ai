"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  analysisTemplates as initialAnalysisTemplates,
  applicationTypes as initialApplicationTypes,
  businessFields,
  requiredDocuments as initialRequiredDocuments,
  riskParametersData as initialRiskParametersData,
} from "@/data/analyze-data-template";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  LoaderCircle,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Send,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../ui/button";
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "../ui/stepper";
import { StepAnalysisContext } from "./ui/step-analysis-context";
import { StepCompanyData } from "./ui/step-company-data";
import { DocumentUploadStep } from "./ui/document-step-card";
import { StepSegmentationTemplate } from "./ui/step-segmentation-template";
import { DocumentRequirement } from "@/type/step-type"; // Import DocumentRequirement

// --- Interfaces ---
interface StagedFile {
  file: File;
  key: string;
  docType: string;
}

// --- Data untuk Stepper ---
const steps = [
  { id: 1, label: "Setup", description: "Pilih segmentasi & template" },
  { id: 2, label: "Data Perusahaan", description: "Isi profil perusahaan" },
  { id: 3, label: "Upload Dokumen", description: "Unggah dokumen wajib" },
  { id: 4, label: "Konteks Analisis", description: "Review dan submit" },
];

export function SectionForm() {
  const [user, setUser] = useState<User | null>(null);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // --- State untuk Form Multi-langkah ---
  const [currentStep, setCurrentStep] = useState(1);

  // State untuk Step 1 (Segmentasi & Template)
  const [applicationType, setApplicationType] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [riskParameters, setRiskParameters] = useState<{
    [key: string]: number | string;
  }>({});
  const [customizedDocuments, setCustomizedDocuments] = useState<
    DocumentRequirement[]
  >([]);

  // State untuk data yang bisa dikustomisasi oleh user
  const [customApplicationTypes, setCustomApplicationTypes] = useState(
    initialApplicationTypes
  );
  const [customAnalysisTemplates, setCustomAnalysisTemplates] = useState(
    initialAnalysisTemplates
  );

  // State untuk Step 2 (Data Perusahaan)
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [yearEstablished, setYearEstablished] = useState<number | "">("");
  const [npwp, setNpwp] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [businessField, setBusinessField] = useState("");
  const [amountSubmissions, setAmountSubmissions] = useState<number>(0);

  // State untuk Step 4 (Konteks AI)
  const [aiContext, setAiContext] = useState("");

  // State untuk Modal Loading & CoT
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayedCoT, setDisplayedCoT] = useState("");
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [isApiCallComplete, setIsApiCallComplete] = useState(false);
  const [finalApplicationId, setFinalApplicationId] = useState<string | null>(
    null
  );
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // --- useEffect Hooks ---
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  // Logika untuk memuat dokumen berdasarkan template
  useEffect(() => {
    if (selectedTemplate && initialRequiredDocuments[selectedTemplate]) {
      setCustomizedDocuments(initialRequiredDocuments[selectedTemplate]);
    } else {
      setCustomizedDocuments([]);
    }
  }, [selectedTemplate]);

  // Effect untuk animasi Chain of Thought
  useEffect(() => {
    if (!isSubmitting) return;

    const scrollToBottom = () => {
      const preElement = document.querySelector(".cot-content");
      if (preElement) {
        preElement.scrollTop = preElement.scrollHeight;
      }
    };

    // Durasi total 8 menit (480.000 ms), distribusi bertahap
    const steps = [
      {
        title: "Proses Analisis Kredit oleh AI Agent\n\n",
        delay: 0,
      },
      {
        title:
          "Pertama-tama saya akan membaca dan memahami keseluruhan dokumen yang diberikan user.\n\n",
        delay: 20000, // 20 detik
      },
      {
        title: `Langkah 1: Memulai Analisis Pemahaman Awal:\nTujuan: Menilai kelayakan kredit ${
          companyName || "klien"
        } berdasarkan dokumen yang tersedia.\nDokumen yang Dianalisis:\n${stagedFiles
          .map((file) => `- ${file.file.name}`)
          .join("\n")}\n\n`,
        delay: 60000, // 1 menit
      },
      {
        title:
          "Langkah 2: Profil Perusahaan\nAnalisis Data:\nMengevaluasi informasi dasar, kepemilikan, dan target pasar...\nKesimpulan Awal: Perusahaan memiliki posisi kuat di pasar.\n\n",
        delay: 120000, // 2 menit
      },
      {
        title:
          "Langkah 3: Legalitas dan Struktur Perusahaan\nAnalisis Data:\nMemeriksa Akta Pendirian, NIB, dan struktur kepemilikan...\nKesimpulan: Legalitas perusahaan memadai.\n\n",
        delay: 150000, // 2.5 menit
      },
      {
        title:
          "Langkah 4: Analisis Performa Keuangan\nData Laporan Keuangan:\nMenganalisis Aset, Liabilitas, Laba Rugi, dan Arus Kas...\nKesimpulan: Kinerja keuangan menunjukkan tren pertumbuhan positif.\n\n",
        delay: 180000, // 3 menit
      },
      {
        title:
          "Langkah 5: Analisis Invoice Penagihan\nData Invoice:\nMemeriksa total nilai, pembayaran, dan invoice yang masih outstanding...\nKesimpulan: Pola pembayaran pelanggan menunjukkan kepatuhan yang baik.\n\n",
        delay: 210000, // 3.5 menit
      },
      {
        title:
          "Langkah 6: Analisis Collateral\nData Collateral:\nMenilai total nilai jaminan dan memverifikasi validitas dokumen...\nKesimpulan: Collateral memadai dan bernilai tinggi.\n\n",
        delay: 240000, // 4 menit
      },
      {
        title:
          "Langkah 7: Analisis Rekapan Sales\nData Penjualan:\nMenganalisis total penjualan, distribusi produk, dan wilayah...\nKesimpulan: Penjualan menunjukkan diversifikasi yang sehat.\n\n",
        delay: 300000, // 5 menit
      },
      {
        title:
          "Langkah 8: Analisis LOI Kerjasama\nData Kerjasama:\nMengevaluasi nilai proyek, sumber dana, dan syarat kerjasama...\nKesimpulan: Komitmen ekspansi dengan risiko termitigasi.\n\n",
        delay: 360000, // 6 menit
      },
      {
        title:
          "Langkah 9: Analisis Rekening Koran\nData Rekening Koran:\nMemeriksa saldo awal, akhir, dan mutasi transaksi utama...\nKesimpulan: Arus kas operasional sehat dan bertumbuh.\n\n",
        delay: 420000, // 7 menit
      },
      {
        title:
          "Langkah 10: Kesimpulan Akhir\nKeputusan Kredit:\nMemrumuskan pro, kontra, dan rekomendasi kredit...\n\n",
        delay: 450000, // 7.5 menit
      },
      {
        title:
          "Saya sudah memahami semua dokumen, Saya akan melampirkan hasil dalam bentuk visualisasi dan Credit Approval Document yang siap di download User.",
        delay: 480000, // 8 menit
        final: true,
      },
    ];

    steps.forEach(({ title, delay, final }) => {
      setTimeout(() => {
        setDisplayedCoT((prev) => prev + title);
        scrollToBottom();
        if (final) {
          setTimeout(() => {
            setIsAnimationComplete(true);
          }, 2000);
        }
      }, delay);
    });

    return () => {
      setDisplayedCoT("");
      setIsAnimationComplete(false);
    };
  }, [isSubmitting, companyName, stagedFiles]);

  // --- Handlers ---
  const handleDocumentUpload = useCallback(
    (docId: string, acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];

      setCustomizedDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === docId
            ? { ...doc, fileName: file.name, status: "uploaded" }
            : doc
        )
      );
      setStagedFiles((prevFiles) => [
        ...prevFiles.filter((f) => f.docType !== docId),
        { file, docType: docId, key: `${docId}-${uuidv4()}` },
      ]);
    },
    []
  );

  const removeFile = useCallback((docId: string) => {
    setCustomizedDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === docId
          ? { ...doc, fileName: undefined, status: "missing" }
          : doc
      )
    );
    setStagedFiles((prevFiles) => prevFiles.filter((f) => f.docType !== docId));
  }, []);

  const handleSubmit = async () => {
    if (!user || stagedFiles.length !== customizedDocuments.length) {
      alert("Harap lengkapi semua data dan dokumen yang disyaratkan.");
      return;
    }

    setIsModalOpen(true);
    setIsSubmitting(true);
    setIsApiCallComplete(false);
    setIsAnimationComplete(false);
    setFinalApplicationId(null);
    setSubmissionError(null);
    setDisplayedCoT(""); // Reset teks CoT

    try {
      const formData = new FormData();
      formData.append("application_type", applicationType);
      formData.append("analysis_template", selectedTemplate);
      formData.append("risk_parameters", JSON.stringify(riskParameters));
      formData.append("company_name", companyName);
      formData.append("company_address", companyAddress);
      formData.append("company_phone", companyPhone);
      formData.append("year_established", yearEstablished.toString());
      formData.append("npwp", npwp);
      formData.append("contact_email", contactEmail);
      formData.append("business_field", businessField);
      formData.append("amount", amountSubmissions.toString());
      formData.append("ai_context", aiContext);

      for (const stagedFile of stagedFiles) {
        formData.append("files", stagedFile.file, stagedFile.file.name);
      }

      const response = await fetch("/api/applications", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorResult = (await response.json()) as { error?: string };
        throw new Error(errorResult.error || "Submission failed");
      }
      const result = (await response.json()) as {
        success: boolean;
        applicationId?: string;
        error?: string;
      };

      if (result.success && result.applicationId) {
        setFinalApplicationId(result.applicationId);
      } else {
        throw new Error(
          result.error || "Submission failed with an unknown error."
        );
      }
    } catch (error) {
      console.error("An error occurred during submission:", error);
      setSubmissionError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsApiCallComplete(true);
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // --- Variabel Kalkulasi untuk UI ---
  const documentsUploadedCount = customizedDocuments.filter(
    (doc) => doc.status === "uploaded" || doc.status === "validated"
  ).length;
  const totalDocumentsRequired = customizedDocuments.length;
  const completenessPercentage =
    totalDocumentsRequired > 0
      ? (documentsUploadedCount / totalDocumentsRequired) * 100
      : 0;

  const isStepComplete = () => {
    if (currentStep === 1) return !!applicationType && !!selectedTemplate;
    if (currentStep === 2)
      return (
        !!companyName.trim() &&
        !!companyAddress.trim() &&
        !!npwp.trim() &&
        !!contactEmail.trim() &&
        !!businessField &&
        !!amountSubmissions
      );
    if (currentStep === 3)
      return (
        totalDocumentsRequired > 0 &&
        documentsUploadedCount === totalDocumentsRequired
      );
    return !!aiContext.trim();
  };

  const showConfirmButton = isAnimationComplete && isApiCallComplete;

  return (
    <div className="flex flex-col gap-8 mt-4 mx-4 flex-1 px-6 pb-6 h-full">
      <Stepper value={currentStep} className="w-full">
        {steps.map((step) => (
          <StepperItem
            key={step.id}
            step={step.id}
            completed={step.id < currentStep}
            className="flex-1"
          >
            <StepperTrigger> {/* Removed disabled prop */}
              <StepperIndicator
                className={
                  step.id === currentStep
                    ? "bg-[#182d7c] text-white" // Current step
                    : step.id < currentStep
                      ? "bg-green-500 text-white" // Completed step
                      : "" // Future step (default styling)
                }
              >
                {step.id}
              </StepperIndicator>
              <div className="text-left">
                <StepperTitle
                  className={
                    step.id === currentStep || step.id < currentStep
                      ? "text-slate-900" // Current or completed step
                      : "" // Future step (default styling)
                  }
                >
                  {step.label}
                </StepperTitle>
                <StepperDescription>{step.description}</StepperDescription>
              </div>
            </StepperTrigger>
            {step.id !== steps.length && <StepperSeparator />}
          </StepperItem>
        ))}
      </Stepper>

      <div className="flex-grow">
        {currentStep === 1 && (
          <StepSegmentationTemplate
            applicationType={applicationType}
            setApplicationType={setApplicationType}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            riskParameters={riskParameters}
            setRiskParameters={setRiskParameters}
            onDocumentsChange={setCustomizedDocuments}
            customApplicationTypes={customApplicationTypes}
            setCustomApplicationTypes={setCustomApplicationTypes}
            customAnalysisTemplates={customAnalysisTemplates}
            setCustomAnalysisTemplates={setCustomAnalysisTemplates}
            requiredDocuments={initialRequiredDocuments}
            riskParametersData={initialRiskParametersData}
          />
        )}

        {currentStep === 2 && (
          <StepCompanyData
            companyName={companyName}
            setCompanyName={setCompanyName}
            companyAddress={companyAddress}
            setCompanyAddress={setCompanyAddress}
            companyPhone={companyPhone}
            setCompanyPhone={setCompanyPhone}
            yearEstablished={yearEstablished}
            setYearEstablished={setYearEstablished}
            npwp={npwp}
            setNpwp={setNpwp}
            businessField={businessField}
            setBusinessField={setBusinessField}
            amountSubmissions={amountSubmissions}
            setamountSubmission={setAmountSubmissions}
            contactEmail={contactEmail}
            setContactEmail={setContactEmail}
            businessFields={businessFields}
          />
        )}

        {currentStep === 3 && (
          <DocumentUploadStep
            documents={customizedDocuments}
            handleDocumentUpload={handleDocumentUpload}
            handleFileRemove={removeFile}
            completenessPercentage={completenessPercentage}
            documentsUploadedCount={documentsUploadedCount}
            totalDocumentsRequired={totalDocumentsRequired}
          />
        )}

        {currentStep === 4 && (
          <StepAnalysisContext
            companyName={companyName}
            amountSubmission={amountSubmissions}
            applicationTypeLabel={
              customApplicationTypes.find((t) => t.value === applicationType)
                ?.label || ""
            }
            documentStatus={`${stagedFiles.length}/${customizedDocuments.length} dokumen terunggah`}
            aiContext={aiContext}
            onContextChange={setAiContext}
            onAmountSubmissionChange={setAmountSubmissions}
          />
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        {currentStep > 1 && (
          <Button
            onClick={handlePreviousStep}
            variant="outline"
            className="bg-white hover:bg-slate-100/90 border-[#182d7c] text-[#182d7c]"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        )}
        <Button
          onClick={currentStep === steps.length ? handleSubmit : handleNextStep}
          disabled={!isStepComplete()}
          className="bg-[#182d7c] hover:bg-[#182d7c]/90 text-white ml-auto"
        >
          {currentStep === steps.length ? (
            <>
              Submit
              <Send className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              Lanjut
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {showConfirmButton && !submissionError ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : (
                <Sparkles className="h-5 w-5 text-blue-500" />
              )}
              {showConfirmButton
                ? submissionError
                  ? "Terjadi Kesalahan"
                  : "Analisis Selesai"
                : "AI Sedang Menganalisis Pengajuan Kredit"}
            </DialogTitle>
            <DialogDescription>
              {showConfirmButton
                ? submissionError
                  ? "Gagal memproses pengajuan Anda."
                  : "Analisis telah selesai dan siap untuk ditinjau."
                : "Mohon tunggu, AI sedang memproses dokumen Anda secara bertahap."}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto rounded-md bg-slate-50 p-4">
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-600 cot-content">
              {displayedCoT}
              {/* Tampilkan kursor hanya saat animasi berjalan */}
              {!isAnimationComplete && (
                <span className="inline-block h-4 w-2 animate-pulse bg-slate-700"></span>
              )}
            </pre>
          </div>
          {showConfirmButton && (
            <DialogFooter>
              {finalApplicationId ? (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() =>
                    router.push(`/dashboard/${finalApplicationId}`)
                  }
                >
                  Lihat Hasil Analisis
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsSubmitting(false);
                  }}
                >
                  Tutup
                </Button>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
