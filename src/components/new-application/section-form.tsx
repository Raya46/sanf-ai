"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../ui/button";
import { DocumentUploadStep } from "./ui/document-step-card";
import { StepSegmentationTemplate } from "./step-segmentation-template";
import { StepCompanyData } from "./step-company-data";

interface StagedFile {
  file: File;
  key: string;
  docType: string;
}

interface DocumentRequirement {
  id: string;
  name: string;
  format: string;
  details: string;
  fileName?: string;
  description?: string;
  status: "uploaded" | "missing" | "validated" | "pending_validation";
}

const initialDocuments: DocumentRequirement[] = [
  {
    id: "rekening_koran",
    name: "1. Rekening Koran 3 bulan",
    format: "PDF",
    details: "Periode: Apr-Jun 2025",
    status: "missing",
  },
  {
    id: "loi_kerjasama",
    name: "2. LOI Kerjasama",
    format: "PDF",
    details: "Pihak: PT Bohir Jaya",
    status: "missing",
  },
  {
    id: "rekapan_sales",
    name: "3. Rekapan Sales 3 bulan",
    format: "PDF/Excel",
    details: "Periode: Apr-Jun 2025",
    status: "missing",
  },
  {
    id: "laporan_keuangan",
    name: "4. Laporan Keuangan 2 tahun",
    format: "PDF",
    details: "Periode: 2023-2024",
    status: "missing",
  },
  {
    id: "invoice_proyek",
    name: "5. Invoice Proyek 2 bulan",
    format: "PDF",
    details: "Periode: Apr-Mei 2025",
    status: "missing",
  },
  {
    id: "dokumen_collateral",
    name: "6. Dokumen Collateral",
    format: "PDF",
    details: "Detail: Sertifikat tanah sebagai jaminan",
    status: "missing",
  },
  {
    id: "legalitas_usaha",
    name: "Legalitas Usaha",
    format: "PDF",
    details: "Dokumen: KTP, NPWP, Akta, NIB, SK Menkeu",
    status: "missing",
  },
  {
    id: "company_profile",
    name: "Company Profile",
    format: "PDF",
    details: "Detail: Profil perusahaan lengkap",
    status: "missing",
  },
];

const applicationTypes = [
  { value: "heavy_equipment", label: "Pembiayaan Alat Berat" },
  { value: "trucking", label: "Trucking" },
  { value: "other", label: "Lain-lain" },
];
const analysisTemplates: { [key: string]: { value: string; label: string }[] } =
  {
    heavy_equipment: [
      {
        value: "heavy_equipment_template_1",
        label: "Template Pembiayaan Alat Berat 1",
      },
      {
        value: "heavy_equipment_template_2",
        label: "Template Pembiayaan Alat Berat 2",
      },
    ],
    trucking: [{ value: "trucking_template_1", label: "Template Trucking 1" }],
    other: [{ value: "other_template_1", label: "Template Lain-lain 1" }],
  };
const requiredDocuments: { [key: string]: DocumentRequirement[] } = {
  heavy_equipment_template_1: [
    {
      id: "rekening_koran",
      name: "Rekening Koran 3 bulan",
      format: "PDF",
      details: "Periode: Apr-Jun 2025",
      status: "missing",
    },
    {
      id: "loi_kerjasama",
      name: "LOI Kerjasama",
      format: "PDF",
      details: "Pihak: PT Bohir Jaya",
      status: "missing",
    },
    {
      id: "rekapan_sales",
      name: "Rekapan Sales 3 bulan",
      format: "PDF/Excel",
      details: "Periode: Apr-Jun 2025",
      status: "missing",
    },
    {
      id: "laporan_keuangan",
      name: "Laporan Keuangan 2 tahun",
      format: "PDF",
      details: "Periode: 2023-2024",
      status: "missing",
    },
    {
      id: "invoice_proyek",
      name: "Invoice Proyek 2 bulan",
      format: "PDF",
      details: "Periode: Apr-Mei 2025",
      status: "missing",
    },
    {
      id: "dokumen_collateral",
      name: "Dokumen Collateral",
      format: "PDF",
      details: "Detail: Sertifikat tanah sebagai jaminan",
      status: "missing",
    },
    {
      id: "legalitas_usaha",
      name: "Legalitas Usaha",
      format: "PDF",
      details: "Dokumen: KTP, NPWP, Akta, NIB, SK Menkeu",
      status: "missing",
    },
    {
      id: "company_profile",
      name: "Company Profile",
      format: "PDF",
      details: "Detail: Profil perusahaan lengkap",
      status: "missing",
    },
  ],
};
const riskParametersData: {
  [key: string]: { [key: string]: string | number };
} = {
  heavy_equipment_template_1: {
    derMaksimal: 3.5,
    quickRatio: 1.2,
    cashRatio: 0.8,
    totalPenjualan: "> Rp5 miliar/tahun",
    usiaPerusahaan: "≥ 2 tahun",
    dscr: "≥ 1.3",
  },
  heavy_equipment_template_2: {
    derMaksimal: 4.0,
    quickRatio: 1.0,
    cashRatio: 0.7,
    totalPenjualan: "> Rp4 miliar/tahun",
    usiaPerusahaan: "≥ 1 tahun",
    dscr: "≥ 1.2",
  },
  trucking_template_1: {
    derMaksimal: 3.0,
    quickRatio: 1.5,
    cashRatio: 1.0,
    totalPenjualan: "> Rp3 miliar/tahun",
    usiaPerusahaan: "≥ 3 tahun",
    dscr: "≥ 1.5",
  },
  other_template_1: {
    derMaksimal: 5.0,
    quickRatio: 0.9,
    cashRatio: 0.6,
    totalPenjualan: "> Rp2 miliar/tahun",
    usiaPerusahaan: "≥ 0.5 tahun",
    dscr: "≥ 1.0",
  },
};
const businessFields = [
  { value: "pertambangan", label: "Pertambangan" },
  { value: "manufaktur", label: "Manufaktur" },
  { value: "jasa", label: "Jasa" },
  { value: "perdagangan", label: "Perdagangan" },
  { value: "konstruksi", label: "Konstruksi" },
  { value: "transportasi", label: "Transportasi" },
  { value: "lainnya", label: "Lainnya" },
];

export function SectionForm() {
  const [user, setUser] = useState<User | null>(null);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [applicationType, setApplicationType] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [riskParameters, setRiskParameters] = useState<{
    [key: string]: number | string;
  }>({});

  const [uploadedDocuments, setUploadedDocuments] = useState<
    DocumentRequirement[]
  >([]);

  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [yearEstablished, setYearEstablished] = useState<number | "">("");
  const [npwp, setNpwp] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [businessField, setBusinessField] = useState("");
  const [numEmployees, setNumEmployees] = useState<number | "">("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingMessage, setProcessingMessage] = useState(
    "Starting analysis..."
  );
  const [progress, setProgress] = useState(0);

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

  useEffect(() => {
    if (selectedTemplate && requiredDocuments[selectedTemplate]) {
      setUploadedDocuments(requiredDocuments[selectedTemplate]);
    } else {
      setUploadedDocuments(initialDocuments); // Use initialDocuments when no template is selected
    }
  }, [selectedTemplate]);

  useEffect(() => {
    if (isSubmitting) {
      const messages = [
        "Uploading documents...",
        "Analyzing document content...",
        "Generating credit analysis...",
        "Finalizing report...",
      ];
      let currentMessageIndex = 0;
      const interval = setInterval(() => {
        setProcessingMessage(messages[currentMessageIndex % messages.length]);
        setProgress((prev) => Math.min(prev + 25, 100));
        currentMessageIndex++;
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setProcessingMessage("Starting analysis...");
      setProgress(0);
    }
  }, [isSubmitting]);

  const handleDocumentUpload = useCallback(
    (docId: string, acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];

      setUploadedDocuments((prevDocs) =>
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
    setUploadedDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === docId
          ? { ...doc, fileName: undefined, status: "missing" }
          : doc
      )
    );
    setStagedFiles((prevFiles) => prevFiles.filter((f) => f.docType !== docId));
  }, []);

  const handleSubmit = async () => {
    if (!user || stagedFiles.length === 0) {
      console.error("User not found or no files staged.");
      alert("Harap unggah semua dokumen wajib terlebih dahulu.");
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
      formData.append("company_email", companyEmail);
      formData.append("business_field", businessField);
      formData.append("num_employees", numEmployees.toString());

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
        router.push(`/dashboard/application/${result.applicationId}`);
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
    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const currentTemplateData = selectedTemplate
    ? analysisTemplates[applicationType]?.find(
        (template) => template.value === selectedTemplate
      )
    : null;

  const documentsUploadedCount = uploadedDocuments.filter(
    (doc) => doc.status === "uploaded" || doc.status === "validated"
  ).length;
  const totalDocumentsRequired = uploadedDocuments.length;
  const completenessPercentage =
    totalDocumentsRequired > 0
      ? (documentsUploadedCount / totalDocumentsRequired) * 100
      : 0;

  return (
    <div className="flex flex-col gap-8 mt-4 mx-4 flex-1">
      {currentStep === 1 && (
        <StepSegmentationTemplate
          applicationType={applicationType}
          setApplicationType={setApplicationType}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          riskParameters={riskParameters}
          setRiskParameters={setRiskParameters}
          handleNextStep={handleNextStep}
          analysisTemplates={analysisTemplates}
          applicationTypes={applicationTypes}
          requiredDocuments={requiredDocuments}
          riskParametersData={riskParametersData}
        />
      )}

      {/* Step 2: Company Data */}
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
          companyEmail={companyEmail}
          setCompanyEmail={setCompanyEmail}
          businessField={businessField}
          setBusinessField={setBusinessField}
          numEmployees={numEmployees}
          setNumEmployees={setNumEmployees}
          handlePreviousStep={handlePreviousStep}
          handleNextStep={handleNextStep}
          businessFields={businessFields}
        />
      )}

      {/* Step 3: Upload Documents */}
      {currentStep === 3 && (
        <div className="flex flex-col gap-4 w-full flex-1">
          <h1 className="text-2xl font-bold">
            Dokumen Wajib - {currentTemplateData?.label}
          </h1>
          <p className="text-sm text-gray-500">
            Semua dokumen harus diunggah dan tervalidasi sebelum melanjutkan ke
            tahap berikutnya.
          </p>

          <div className="flex flex-col gap-4 mt-4">
            <DocumentUploadStep
              documents={uploadedDocuments}
              handleDocumentUpload={handleDocumentUpload}
              handleFileRemove={removeFile}
              completenessPercentage={completenessPercentage}
              documentsUploadedCount={documentsUploadedCount}
              totalDocumentsRequired={totalDocumentsRequired}
            />
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={handlePreviousStep}>
              Previous
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={documentsUploadedCount !== totalDocumentsRequired}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Loading Modal */}
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
