"use client";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { File } from "lucide-react";

interface ApplicationFile {
  id: string;
  file_name: string;
}

interface CreditListFileProps {
  applicationId?: string;
}

export function CreditListFile({ applicationId }: CreditListFileProps) {
  const [files, setFiles] = useState<ApplicationFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!applicationId) return;

    const fetchFiles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/applications/${applicationId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch application files");
        }
        const data = (await response.json()) as {
          application_files: ApplicationFile[];
        };
        setFiles(data.application_files || []);
      } catch (error) {
        console.error(error);
        setFiles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [applicationId]);

  return (
    <div className="h-full flex-shrink-0 rounded-lg bg-white p-4 flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 p-2">
          <p className="font-semibold">Dokumen Terunggah</p>
        </div>
        {isLoading ? (
          <>
            <div className="flex items-center gap-2 p-2">
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="flex items-center gap-2 p-2">
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="flex items-center gap-2 p-2">
              <Skeleton className="h-6 w-full" />
            </div>
          </>
        ) : files.length > 0 ? (
          files.map((file) => (
            <div key={file.id} className="flex items-center gap-2 p-2 w-full">
              <File className="h-4 w-4 flex-shrink-0" />
              <p className="truncate text-sm">{file.file_name}</p>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-2 p-2">
            <p className="text-sm text-gray-500">
              Tidak ada file ditemukan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}