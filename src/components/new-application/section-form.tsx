"use client";
import { Download, Plus, X, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { CardDescription } from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useDropzone } from "react-dropzone";
import { useCallback, useState, useMemo, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

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
  const [companyName, setCompanyName] = useState("");
  const [applicationType, setApplicationType] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

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
    setIsFormValid(
      companyName.trim() !== "" &&
        applicationType.trim() !== "" &&
        contactPerson.trim() !== "" &&
        contactEmail.trim() !== ""
    );
  }, [companyName, applicationType, contactPerson, contactEmail]);

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  const removeFile = (key: string) => {
    setStagedFiles((prevFiles) => prevFiles.filter((f) => f.key !== key));
  };

  const hasEnoughFiles = useMemo(() => {
    return stagedFiles.length >= 5;
  }, [stagedFiles]);

  const handleSubmit = async () => {
    if (!user || !isFormValid) {
      console.error("User not found or form is invalid.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create a single FormData object for everything
      const formData = new FormData();

      // 2. Append all form fields
      formData.append("company_name", companyName);
      formData.append("application_type", applicationType);
      formData.append("contact_person", contactPerson);
      formData.append("contact_email", contactEmail);

      // 3. Append all staged files under the same key 'files'
      for (const stagedFile of stagedFiles) {
        formData.append("files", stagedFile.file);
      }

      // 4. Send a single request to the new unified endpoint
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
        router.push(`/new-application/${result.applicationId}`);
      } else {
        console.error("Submission failed with error:", result.error);
        // TODO: Show an error message to the user
      }
    } catch (error) {
      console.error("An error occurred during submission:", error);
      // TODO: Show a generic error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-row gap-8 mt-4 mx-4 flex-1">
      <div className="flex flex-col gap-2 w-full flex-1">
        <p>Company Name</p>
        <Input
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <p>Application Type</p>
        <Select onValueChange={setApplicationType} value={applicationType}>
          <SelectTrigger
            className="flex w-full **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
            size="sm"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
        <p>Contact Person</p>
        <Input
          value={contactPerson}
          onChange={(e) => setContactPerson(e.target.value)}
        />
        <p>Contact Email</p>
        <Input
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-4 mt-4 w-full flex-1">
        <h1>Upload Supporting Document</h1>
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
                  <p>Drag & drop PDF files here or</p>
                  <p className="text-blue-500 font-bold">Browse</p>
                </>
              )}
            </div>
            <CardDescription className="mt-2">
              Supports PDF only. Please upload at least 5 documents.
            </CardDescription>
          </div>
        </div>
        {stagedFiles.length > 0 && (
          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-2">
              Staged Files ({stagedFiles.length})
            </h2>
            <div className="flex flex-col gap-2">
              {stagedFiles.map((stagedFile) => (
                <div
                  key={stagedFile.key}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded-md"
                >
                  <p className="text-sm truncate">{stagedFile.file.name}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(stagedFile.key)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        <Button
          className="bg-blue-600 flex flex-row items-center self-end"
          disabled={!hasEnoughFiles || isSubmitting || !isFormValid}
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <LoaderCircle className="animate-spin mr-2" />
          ) : (
            <Plus className="mr-2" />
          )}
          <span>{isSubmitting ? "Submitting..." : "Submit Application"}</span>
        </Button>
      </div>
    </div>
  );
}
