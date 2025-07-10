"use client";

import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Download, X } from "lucide-react";
import { useCallback } from "react";
import { FileRejection, useDropzone } from "react-dropzone";

// Tipe data untuk setiap dokumen
interface DocumentRequirement {
  id: string;
  name: string;
  format: string;
  details: string;
  fileName?: string;
  description?: string;
  status: "uploaded" | "missing" | "validated" | "pending_validation";
}

// Data awal berdasarkan list yang Anda berikan
const initialDocuments: DocumentRequirement[] = [
  {
    id: "rekening_koran",
    name: "1. Rekening Koran 3 bulan",
    format: "PDF",
    details: "Periode: Apr-Jun 2025",
    fileName: "rekening_koran_apr-jun2025.pdf",
    status: "missing",
  },
  {
    id: "loi_kerjasama",
    name: "2. LOI Kerjasama",
    format: "PDF",
    details: "Pihak: PT Bohir Jaya",
    fileName: "loi_bohir_jaya.pdf",
    status: "missing",
  },
  {
    id: "rekapan_sales",
    name: "3. Rekapan Sales 3 bulan",
    format: "PDF/Excel",
    details: "Periode: Apr-Jun 2025",
    fileName: "rekapan_sales_Q2_2025.xlsx",
    status: "missing",
  },
  {
    id: "laporan_keuangan",
    name: "4. Laporan Keuangan 2 tahun",
    format: "PDF",
    details: "Periode: 2023-2024",
    fileName: "lapkeu_2023-2024.pdf",
    status: "missing",
  },
  {
    id: "invoice_proyek",
    name: "5. Invoice Proyek 2 bulan",
    format: "PDF",
    details: "Periode: Apr-Mei 2025",
    fileName: "invoice_apr-mei_2025.pdf",
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
    name: "7. Legalitas Usaha",
    format: "PDF",
    details: "Dokumen: KTP, NPWP, Akta, NIB, SK Menkeu",
    status: "missing",
  },
  {
    id: "company_profile",
    name: "8. Company Profile",
    format: "PDF",
    details: "Detail: Profil perusahaan lengkap",
    status: "missing",
  },
];

// Komponen kecil untuk area Dropzone
function FileUploader({
  onFileUpload,
}: {
  onFileUpload: (file: File) => void;
}) {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        alert("File tidak valid atau terlalu besar. Maksimal 10MB.");
        return;
      }
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10 MB
  });

  return (
    <div
      {...getRootProps()}
      className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-[#FBFDFF] p-4 transition-colors ${
        isDragActive
          ? "border-green-500 bg-green-50"
          : "border-blue-400/50 hover:border-blue-600"
      }`}
    >
      <input {...getInputProps()} />
      <div className="py-4 text-center">
        <Download color="#007BFF" size={24} className="mx-auto mb-2" />
        <div className="flex justify-center gap-1 text-sm">
          {isDragActive ? (
            <p className="font-bold text-green-500">Lepaskan file di sini...</p>
          ) : (
            <>
              <p>Drag & drop file di sini atau</p>
              <p className="font-bold text-blue-500 underline">Pilih File</p>
            </>
          )}
        </div>
        <CardDescription className="mt-1">
          Maksimal 10MB, format PDF/JPEG
        </CardDescription>
      </div>
    </div>
  );
}

interface DocumentUploadStepProps {
  documents: DocumentRequirement[];
  handleDocumentUpload: (docId: string, files: File[]) => void;
  handleFileRemove: (docId: string) => void;
  completenessPercentage: number;
  documentsUploadedCount: number;
  totalDocumentsRequired: number;
}

export function DocumentUploadStep({
  documents,
  handleDocumentUpload,
  handleFileRemove,
  completenessPercentage,
  documentsUploadedCount,
  totalDocumentsRequired,
}: DocumentUploadStepProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-4">
        <p className="font-semibold text-sm whitespace-nowrap">
          Kelengkapan Dokumen
        </p>
        <Progress value={completenessPercentage} className="w-full" />
        <span className="text-sm font-medium text-gray-700">
          {documentsUploadedCount}/{totalDocumentsRequired} (
          {completenessPercentage.toFixed(0)}%)
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="rounded-lg border bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold text-gray-800">
                {doc.name}
              </Label>
              {doc.fileName ? (
                <span className="text-sm font-medium text-green-600">
                  Tersedia
                </span>
              ) : (
                <span className="text-sm font-medium text-red-500">
                  Belum diunggah
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{doc.details}</p>

            {/* Tampilan Kondisional: Menampilkan nama file atau area upload */}
            {doc.fileName ? (
              <div className="mt-2 flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 p-2">
                <p className="flex-grow cursor-pointer font-medium text-blue-600">
                  {doc.fileName}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 text-red-500 hover:bg-red-100"
                  onClick={() => handleFileRemove(doc.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <FileUploader
                onFileUpload={(file) => handleDocumentUpload(doc.id, [file])}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
