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
import { StepSegmentationTemplate } from "./ui/step-segmentation-template";
import { StepCompanyData } from "./ui/step-company-data";
import { StepAnalysisContext } from "./ui/step-analysis-context";
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "../ui/stepper";
import {
  analysisTemplates,
  applicationTypes,
  businessFields,
  initialDocuments,
  requiredDocuments,
  riskParametersData,
} from "@/data/analyze-data-template";

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
  const [numSubmssion, setNumSubmssion] = useState<number | "">("");

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
      setUploadedDocuments(initialDocuments);
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
      formData.append("num_employees", numSubmssion.toString());

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
  const steps = [
    { id: 1, label: "Setup", description: "Pilih segmentasi" },
    { id: 2, label: "Aplikasi Kredit", description: "Isi data perusahaan" },
    { id: 3, label: "Upload Dokumen", description: "Unggah dokumen wajib" },
    { id: 4, label: "Input Konteks AI", description: "Review dan submit" },
  ];

  return (
    <div className="flex flex-col gap-8 mt-4 mx-4 flex-1">
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
                  <h1>{label}</h1>
                  <StepperDescription>{description}</StepperDescription>
                </div>
              </div>
            </StepperTrigger>
            {id < steps.length && <StepperSeparator />}
          </StepperItem>
        ))}
      </Stepper>
      {currentStep === 1 && (
        <>
          <StepSegmentationTemplate
            applicationType={applicationType}
            setApplicationType={setApplicationType}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            riskParameters={riskParameters}
            setRiskParameters={setRiskParameters}
            analysisTemplates={analysisTemplates}
            applicationTypes={applicationTypes}
            requiredDocuments={requiredDocuments}
            riskParametersData={riskParametersData}
          />
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={handlePreviousStep}>
              Previous
            </Button>
            <Button onClick={handleNextStep}>Next</Button>
          </div>
        </>
      )}

      {/* Step 2: Company Data */}
      {currentStep === 2 && (
        <>
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
            numSubmission={numSubmssion}
            setNumSubmission={setNumSubmssion}
            handlePreviousStep={handlePreviousStep}
            handleNextStep={handleNextStep}
            businessFields={businessFields}
          />
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={handlePreviousStep}>
              Previous
            </Button>
            <Button onClick={handleNextStep}>Next</Button>
          </div>
        </>
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
            <Button onClick={handleNextStep}>Next</Button>
          </div>
        </div>
      )}
      {currentStep === 4 && (
        <div className="flex flex-col gap-4 w-full flex-1">
          <StepAnalysisContext
            companyName={companyName}
            applicationTypeLabel={
              applicationTypes.find((type) => type.value === applicationType)
                ?.label || "Tidak Diketahui"
            }
            documentStatus={`${documentsUploadedCount}/${totalDocumentsRequired} Lengkap`}
            financingValue="Rp 5.500.000.000"
            onBack={handlePreviousStep}
            onSubmit={handleSubmit}
          />
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={handlePreviousStep}>
              Previous
            </Button>
            <Button onClick={handleSubmit}>Analisa AI</Button>
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
