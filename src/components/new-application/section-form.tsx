"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  analysisTemplates as initialAnalysisTemplates,
  applicationTypes as initialApplicationTypes,
  businessFields,
  requiredDocuments as initialRequiredDocuments,
  riskParametersData as initialRiskParametersData,
} from "@/data/analyze-data-template";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { LoaderCircle } from "lucide-react";
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
  const [amountSubmissions, setamountSubmissions] = useState<number>(0);

  // State untuk Step 4 (Konteks AI)
  const [aiContext, setAiContext] = useState("");

  // State untuk Modal Loading
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingMessage, setProcessingMessage] = useState(
    "Starting analysis..."
  );
  const [progress, setProgress] = useState(0);

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

  // PERBAIKAN: Logika untuk memuat dokumen berdasarkan template
  useEffect(() => {
    if (selectedTemplate && initialRequiredDocuments[selectedTemplate]) {
      setCustomizedDocuments(initialRequiredDocuments[selectedTemplate]);
    } else {
      setCustomizedDocuments([]); // Kosongkan jika tidak ada template terpilih
    }
  }, [selectedTemplate]);

  useEffect(() => {
    if (isSubmitting) {
      const steps = [
        {
          title: "Memulai Analisis",
          description: "Menilai kelayakan kredit...",
          progress: 5,
        },
        {
          title: "Memahami Dokumen",
          description: "Membaca semua dokumen input.",
          progress: 15,
        },
        {
          title: "Analisis Profil Perusahaan",
          description: "Mengevaluasi informasi dasar, kepemilikan, dan pasar.",
          progress: 25,
        },
        {
          title: "Verifikasi Legalitas",
          description:
            "Memeriksa Akta Pendirian, NIB, dan struktur perusahaan.",
          progress: 35,
        },
        {
          title: "Analisis Performa Keuangan",
          description:
            "Menganalisis Laporan Keuangan (Aset, Liabilitas, Laba Rugi).",
          progress: 45,
        },
        {
          title: "Analisis Arus Kas",
          description: "Memeriksa mutasi pada Rekening Koran 3 bulan terakhir.",
          progress: 55,
        },
        {
          title: "Evaluasi Penjualan & Invoice",
          description:
            "Memeriksa rekapan sales dan histori pembayaran invoice.",
          progress: 65,
        },
        {
          title: "Penilaian Collateral",
          description: "Menilai nilai jaminan dan validitas dokumen.",
          progress: 75,
        },
        {
          title: "Analisis Komitmen & Kerjasama",
          description: "Mengevaluasi LOI dan potensi proyek masa depan.",
          progress: 85,
        },
        {
          title: "Menyusun Kesimpulan",
          description: "Merumuskan pro, kontra, dan rekomendasi kredit.",
          progress: 95,
        },
        {
          title: "Finalisasi Analisis",
          description: "Menyiapkan dokumen hasil analisis.",
          progress: 100,
        },
      ];

      let stepIndex = 0;
      const interval = setInterval(() => {
        if (stepIndex < steps.length) {
          const currentStep = steps[stepIndex];
          setProcessingMessage(
            `${currentStep.title}\n${currentStep.description}`
          );
          setProgress(currentStep.progress);
          stepIndex++;
        } else {
          clearInterval(interval);
        }
      }, 2000); // Setiap langkah ditampilkan selama 2 detik

      return () => clearInterval(interval);
    } else {
      setProcessingMessage("Starting analysis...");
      setProgress(0);
    }
  }, [isSubmitting]);

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
    if (!user) {
      alert("Sesi Anda telah berakhir. Silakan login kembali.");
      return;
    }
    if (stagedFiles.length !== customizedDocuments.length) {
      alert("Harap unggah semua dokumen yang disyaratkan.");
      return;
    }

    setIsSubmitting(true);
    setIsModalOpen(true);

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
      formData.append("company_type", businessField);
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
        router.push(`/dashboard/${result.applicationId}`);
      } else {
        throw new Error(
          result.error || "Submission failed with an unknown error."
        );
      }
    } catch (error) {
      console.error("An error occurred during submission:", error);
      alert(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
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
      return !!companyName.trim() && !!companyAddress.trim() && !!npwp.trim();
    if (currentStep === 3)
      return (
        totalDocumentsRequired > 0 &&
        documentsUploadedCount === totalDocumentsRequired
      );
    return true;
  };

  return (
    <div className="flex flex-col gap-8 mt-4 mx-4 flex-1 h-full">
      <Stepper
        value={currentStep}
        onValueChange={setCurrentStep}
        className="w-full"
      >
        {steps.map(({ id, label, description }) => (
          <StepperItem key={id} step={id} className="not-last:flex-1">
            <StepperTrigger>
              <div className="flex items-center gap-2">
                <StepperIndicator />
                <div>
                  <StepperTitle>{label}</StepperTitle>
                  <StepperDescription>{description}</StepperDescription>
                </div>
              </div>
            </StepperTrigger>
            {id < steps.length && <StepperSeparator />}
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
            contactEmail={contactEmail}
            setContactEmail={setContactEmail}
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
            setamountSubmission={setamountSubmissions}
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
            applicationTypeLabel={
              customApplicationTypes.find(
                (type) => type.value === applicationType
              )?.label || "Tidak Diketahui"
            }
            documentStatus={`${documentsUploadedCount}/${totalDocumentsRequired} Lengkap`}
            amountSubmission={amountSubmissions as number}
            onAmountSubmissionChange={setamountSubmissions}
            aiContext={aiContext}
            onContextChange={setAiContext}
          />
        )}
      </div>

      <div className="flex w-full justify-between mt-auto pt-4 border-t">
        <Button
          variant="outline"
          onClick={handlePreviousStep}
          disabled={currentStep === 1 || isSubmitting}
        >
          Previous
        </Button>

        {currentStep < steps.length ? (
          <Button
            onClick={handleNextStep}
            disabled={!isStepComplete() || isSubmitting}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !isStepComplete()}
          >
            {isSubmitting ? (
              <LoaderCircle className="animate-spin mr-2" />
            ) : null}
            Analisa AI
          </Button>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Processing Application</DialogTitle>
            <DialogDescription>
              Please wait while we analyze your documents.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <LoaderCircle className="animate-spin h-12 w-12 text-blue-500" />
            <p className="text-lg font-medium">{processingMessage}</p>
            <Progress value={progress} className="w-full" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
