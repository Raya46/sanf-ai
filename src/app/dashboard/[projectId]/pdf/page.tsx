"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
// PERBAIKAN: Menggunakan path impor CSS yang benar untuk versi react-pdf terbaru
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

// Mengatur worker untuk react-pdf. Baris ini penting agar library bisa bekerja.
// Menggunakan unpkg untuk versi yang lebih stabil dan modern.
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfViewerPage() {
  const router = useRouter();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.5); // Level zoom awal
  const [pageInput, setPageInput] = useState("1");
  const [isLoading, setIsLoading] = useState(true);

  // Path ke file PDF Anda di dalam folder public
  const pdfFile = "/CAR_PT_Batubara_Sejahtera_20250711031531.pdf";

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setIsLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error("Failed to load PDF:", error);
    setIsLoading(false);
  }

  // Fungsi untuk navigasi halaman
  const goToPage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newPageNumber = parseInt(pageInput, 10);
    if (numPages && newPageNumber >= 1 && newPageNumber <= numPages) {
      setPageNumber(newPageNumber);
    } else {
      // Jika input tidak valid, kembalikan ke nomor halaman saat ini
      setPageInput(String(pageNumber));
    }
  };

  // Sinkronkan input field dengan nomor halaman saat ini
  useEffect(() => {
    setPageInput(String(pageNumber));
  }, [pageNumber]);

  const handlePrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setPageNumber((prev) => (numPages ? Math.min(prev + 1, numPages) : prev));
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3)); // Maksimal zoom 3x
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5)); // Minimal zoom 0.5x

  return (
    <div className="flex h-screen flex-col items-center bg-gray-100 p-4 dark:bg-gray-900 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl">
        {/* Panel Kontrol yang Melayang (Sticky) */}
        <Card className="sticky top-4 z-10 mb-4 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
          <CardContent className="flex flex-wrap items-center justify-center gap-2 p-2 sm:p-3 sm:justify-between">
            {/* Kontrol Navigasi Halaman */}
            <Button onClick={() => router.back()}>
              <ChevronLeft />
            </Button>
            <div className="flex items-center gap-2">
              <Button
                onClick={handlePrevPage}
                disabled={pageNumber <= 1}
                variant="ghost"
                size="icon"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                Halaman
                <form onSubmit={goToPage} className="mx-1.5 inline-block">
                  <Input
                    type="text"
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    className="h-8 w-12 text-center"
                  />
                </form>
                dari {numPages ?? "..."}
              </div>
              <Button
                onClick={handleNextPage}
                disabled={!numPages || pageNumber >= numPages}
                variant="ghost"
                size="icon"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Kontrol Zoom */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
                variant="ghost"
                size="icon"
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
              <span className="min-w-[45px] text-center text-sm text-gray-700 dark:text-gray-300">
                {Math.round(scale * 100)}%
              </span>
              <Button
                onClick={handleZoomIn}
                disabled={scale >= 3}
                variant="ghost"
                size="icon"
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Area Tampilan PDF */}
        <div className="flex justify-center">
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex h-96 flex-col items-center justify-center text-gray-500">
                <Loader2 className="mb-2 h-8 w-8 animate-spin" />
                <span>Memuat PDF...</span>
              </div>
            }
            error={
              <div className="flex h-96 flex-col items-center justify-center text-red-500">
                <p>Gagal memuat file PDF.</p>
                <p className="mt-1 text-sm text-gray-500">
                  Pastikan file ada di {pdfFile}
                </p>
              </div>
            }
            className="flex justify-center"
          >
            {!isLoading && numPages && (
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderAnnotationLayer={true}
                renderTextLayer={true}
                className="shadow-2xl"
                loading={
                  <div
                    className="flex items-center justify-center bg-gray-200"
                    style={{ width: 700 * scale, height: 990 * scale }}
                  >
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                  </div>
                }
              />
            )}
          </Document>
        </div>
      </div>
    </div>
  );
}
