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
import { useCallback, useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { submitApplication } from "@/app/actions";

interface StagedFile {
  file: File;
  key: string;
  docType: string;
}

export function SectionForm() {
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => {
      return {
        file,
        docType: "document",
        key: `document-${uuidv4()}`,
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
    setIsSubmitting(true);

    const uploadedFilesForAction = [];

    for (const stagedFile of stagedFiles) {
      try {
        const formData = new FormData();
        formData.append("file", stagedFile.file);
        formData.append("key", stagedFile.key);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Upload failed");
        }

        const result = await res.json();
        if (!result.success) {
          throw new Error("Upload failed");
        }

        uploadedFilesForAction.push({
          file_type: stagedFile.docType,
          file_name: stagedFile.file.name,
          r2_object_key: result.key,
          file_size_bytes: stagedFile.file.size,
        });
      } catch (error) {
        console.error("Upload failed for", stagedFile.file.name, error);

        setIsSubmitting(false);
        return;
      }
    }

    const result = await submitApplication({
      status: "submitted",
      files: uploadedFilesForAction,
    });

    if (result.success && result.applicationId) {
      router.push(`/new-application/${result.applicationId}`);
    } else {
      console.error("Submission failed", result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-row gap-8 mt-4 mx-4 flex-1">
      <div className="flex flex-col gap-2 w-full flex-1">
        <p>Company Name</p>
        <Input />
        <p>Application Type</p>
        <Select>
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
        <Input />
        <p>Contact Email</p>
        <Input />
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
          disabled={!hasEnoughFiles || isSubmitting}
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
