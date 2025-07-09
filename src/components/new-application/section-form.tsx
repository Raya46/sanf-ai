"use client";
import { Download, Plus, X, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { CardDescription } from "../ui/card";
import { Input } from "../ui/input"; // Re-add Input import
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useDropzone } from "react-dropzone";
import { useCallback, useState, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

interface StagedFile {
  file: File;
  key: string;
  docType: string;
}

export function SectionForm() {
  const [user, setUser] = useState<User | null>(null);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Step-by-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedDocType, setSelectedDocType] = useState("pdf"); // Default to PDF
  const [riskAppetite, setRiskAppetite] = useState([50]); // Default to 50%
  const [companyType, setCompanyType] = useState("");
  const [amount, setAmount] = useState<number | "">("");

  // Original form fields (might be integrated into steps or removed)

  // Loading modal state
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

  // Update progress message during submission (simulated)
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
        setProcessingMessage(messages[currentMessageIndex]);
        setProgress((prev) => Math.min(prev + 25, 100));
        currentMessageIndex = (currentMessageIndex + 1) % messages.length;
      }, 1500); // Change message every 1.5 seconds

      return () => clearInterval(interval);
    } else {
      setProcessingMessage("Starting analysis...");
      setProgress(0);
    }
  }, [isSubmitting]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => {
      return {
        file,
        docType: "document",
        key: `document-${uuidv4()}.pdf`,
      };
    });
    setStagedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, []);

  const acceptedFileTypes = useMemo(() => {
    const types: { [key: string]: string[] } = {
      "application/pdf": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
      "application/msword": [],
    };

    if (selectedDocType === "pdf") {
      types["application/pdf"] = [".pdf"];
    } else if (selectedDocType === "docx") {
      types[
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ] = [".docx"];
      types["application/msword"] = [".doc"];
    }
    return types;
  }, [selectedDocType]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
  });

  const removeFile = (key: string) => {
    setStagedFiles((prevFiles) => prevFiles.filter((f) => f.key !== key));
  };

  const handleSubmit = async () => {
    if (!user || stagedFiles.length === 0) {
      console.error("User not found or no files staged.");
      return;
    }

    setIsSubmitting(true);
    setIsModalOpen(true); // Open the loading modal

    try {
      const formData = new FormData();

      formData.append("analysis_template", selectedTemplate);
      formData.append("risk_appetite", riskAppetite[0].toString()); // Slider value is an array
      formData.append("company_type", companyType);
      formData.append("amount", amount.toString());

      for (const stagedFile of stagedFiles) {
        formData.append("files", stagedFile.file);
      }

      const response = await fetch("/api/applications", {
        method: "POST",
        body: formData, // No 'Content-Type' header needed, browser sets it for FormData
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
        router.push(
          `/dashboard/${result.applicationId}/chat/${result.applicationId}`
        );
      } else {
        console.error("Submission failed with error:", result.error);
      }
    } catch (error) {
      console.error("An error occurred during submission:", error);
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false); // Close the loading modal
    }
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="flex flex-col gap-8 mt-4 mx-4 flex-1">
      {currentStep === 1 && (
        <div className="flex flex-col gap-4 w-full flex-1">
          <h1 className="text-2xl font-bold">
            Step 1: Choose Analysis Template
          </h1>
          <p>Select the type of credit analysis you need.</p>
          <Select onValueChange={setSelectedTemplate} value={selectedTemplate}>
            <SelectTrigger
              className="w-full"
              aria-label="Select analysis template"
            >
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem
                value="standard_credit_analysis"
                className="rounded-lg"
              >
                Standard Credit Analysis
              </SelectItem>
              <SelectItem value="sme_loan_analysis" className="rounded-lg">
                SME Loan Analysis
              </SelectItem>
              <SelectItem
                value="corporate_finance_analysis"
                className="rounded-lg"
              >
                Corporate Finance Analysis
              </SelectItem>
            </SelectContent>
          </Select>

          <p>Company Type</p>
          <Select onValueChange={setCompanyType} value={companyType}>
            <SelectTrigger className="w-full" aria-label="Select company type">
              <SelectValue placeholder="Select company type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="Heavy Equipment" className="rounded-lg">
                Heavy Equipment
              </SelectItem>
              <SelectItem value="Trucking" className="rounded-lg">
                Trucking
              </SelectItem>
              <SelectItem value="Productive" className="rounded-lg">
                Productive
              </SelectItem>
              <SelectItem value="New Business" className="rounded-lg">
                New Business
              </SelectItem>
            </SelectContent>
          </Select>

          <p>Amount</p>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || "")}
            placeholder="Enter amount"
          />

          <div className="flex justify-end">
            <Button
              onClick={handleNextStep}
              disabled={!selectedTemplate || !companyType || amount === ""}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Choose Document Type & Upload File */}
      {currentStep === 2 && (
        <div className="flex flex-col gap-4 w-full flex-1">
          <h1 className="text-2xl font-bold">Step 2: Upload Documents</h1>
          <p>Select document type and upload your files (PDF or Word).</p>

          <Select onValueChange={setSelectedDocType} value={selectedDocType}>
            <SelectTrigger className="w-full" aria-label="Select document type">
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="pdf" className="rounded-lg">
                PDF (.pdf)
              </SelectItem>
              <SelectItem value="docx" className="rounded-lg">
                Word (.docx, .doc)
              </SelectItem>
            </SelectContent>
          </Select>

          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center border border-dashed rounded-lg p-4 bg-[#FBFDFF] ${
              isDragActive ? "border-green-500" : "border-blue-400"
            }`}
          >
            <input {...getInputProps()} />
            <div className="py-10 text-center">
              <Download color="#007BFF" size={40} className="mb-4 mx-auto" />
              <div className="flex gap-1 justify-center">
                {isDragActive ? (
                  <p className="text-green-500 font-bold">
                    Drop the files here ...
                  </p>
                ) : (
                  <>
                    <p>
                      Drag & drop {selectedDocType.toUpperCase()} files here or
                    </p>
                    <p className="text-blue-500 font-bold">Browse</p>
                  </>
                )}
              </div>
              <CardDescription className="mt-2">
                Supports {selectedDocType.toUpperCase()} only. Please upload at
                least 1 document.
              </CardDescription>
            </div>
          </div>
          {stagedFiles.length > 0 && (
            <div className="p-4 border border-dashed rounded-lg flex flex-wrap gap-2">
              {stagedFiles.map((stagedFile) => (
                <div
                  key={stagedFile.key}
                  className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-sm"
                >
                  <p className="truncate max-w-[150px]">
                    {stagedFile.file.name}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0"
                    onClick={() => removeFile(stagedFile.key)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePreviousStep}>
              Previous
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={stagedFiles.length === 0}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Choose Risk Appetite */}
      {currentStep === 3 && (
        <div className="flex flex-col gap-4 w-full flex-1">
          <h1 className="text-2xl font-bold">Step 3: Choose Risk Appetite</h1>
          <p>
            Adjust the slider to set your desired risk appetite for the
            analysis.
          </p>
          <div className="flex flex-col items-center gap-4 p-4 border rounded-lg">
            <p className="text-lg font-semibold">
              Risk Appetite: {riskAppetite[0]}%
            </p>
            <Slider
              defaultValue={[50]}
              max={100}
              step={1}
              onValueChange={setRiskAppetite}
              className="w-3/4"
            />
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePreviousStep}>
              Previous
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || stagedFiles.length === 0}
            >
              {isSubmitting ? (
                <LoaderCircle className="animate-spin mr-2" />
              ) : (
                <Plus className="mr-2" />
              )}
              <span>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </span>
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
