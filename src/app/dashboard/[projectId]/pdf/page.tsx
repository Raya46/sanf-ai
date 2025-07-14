"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Document, Page as PdfPage, pdfjs } from "react-pdf";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  ZoomIn,
  ZoomOut,
  Loader2,
  Download,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

// Mengatur worker untuk react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfViewerPage() {
  const router = useRouter();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(0.8);
  const [pageInput, setPageInput] = useState("1");
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [statusDialog, setStatusDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    isError: false,
  });

  const pdfFile = "/CAR_PT_Batubara_Sejahtera_20250711031531.pdf";

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setIsLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error("Failed to load PDF:", error);
    setIsLoading(false);
    setStatusDialog({
      isOpen: true,
      title: "Error",
      message: "Failed to load PDF file",
      isError: true,
    });
  }

  // PERBAIKAN: Fungsi untuk mengubah Blob menjadi Data URL (base64)
  const convertBlobToDataUrl = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // PERBAIKAN: Fungsi handleSendEmail diperbarui
  const handleSendEmail = async () => {
    if (!emailTo) return;

    setIsSending(true);
    try {
      // 1. Ambil file PDF dari public folder
      const fileResponse = await fetch(pdfFile);
      if (!fileResponse.ok) throw new Error("Could not fetch PDF file.");
      const pdfBlob = await fileResponse.blob();

      // 2. Ubah menjadi Data URL
      const pdfDataUrl = await convertBlobToDataUrl(pdfBlob);

      // 3. Kirim Data URL ke API
      const apiResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: emailTo,
          subject: `Credit Approval Recomendation - ${new Date().toLocaleDateString()}`,
          text: `Mitra yang Terhormat,\n\nDengan senang hati kami sampaikan Credit Approval Recommendation untuk Anda tinjau.\n\nSalam hormat,\nTim Sanf AI`,
          pdfDataUrl: pdfDataUrl, // Mengirim data yang benar
        }),
      });

      if (!apiResponse.ok) {
        const errorBody = await apiResponse.json();
        throw new Error("Failed to send email via API");
      }

      setStatusDialog({
        isOpen: true,
        title: "Success",
        message: "The report has been sent successfully",
        isError: false,
      });
      setIsEmailDialogOpen(false);
    } catch (error) {
      setStatusDialog({
        isOpen: true,
        title: "Error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to send email. Please try again.",
        isError: true,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfFile;
    link.download = "credit-analysis-report.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const goToPage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newPageNumber = parseInt(pageInput, 10);
    if (numPages && newPageNumber >= 1 && newPageNumber <= numPages) {
      setPageNumber(newPageNumber);
    } else {
      setPageInput(String(pageNumber));
    }
  };

  useEffect(() => {
    setPageInput(String(pageNumber));
  }, [pageNumber]);

  const handlePrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setPageNumber((prev) => (numPages ? Math.min(prev + 1, numPages) : prev));
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  return (
    <div className="flex h-screen flex-col items-center bg-gray-100 p-4 dark:bg-gray-900 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl">
        <Card className="sticky top-4 z-10 mb-4 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
          <CardContent className="flex flex-wrap items-center justify-center gap-2 p-2 sm:p-3 sm:justify-between">
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="icon"
              title="Kembali"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Kontrol Navigasi Halaman */}
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

            {/* Kontrol Zoom & Share */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
                variant="ghost"
                size="icon"
                title="Zoom Out"
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
                title="Zoom In"
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                onClick={() => setIsEmailDialogOpen(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dialog untuk mengirim email */}
        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share via Email</DialogTitle>
              <DialogDescription>
                Enter the email address where you'd like to send this report.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                type="email"
                placeholder="recipient@example.com"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEmailDialogOpen(false)}
                disabled={isSending}
              >
                Cancel
              </Button>
              <Button onClick={handleSendEmail} disabled={isSending}>
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog untuk status (sukses/error) */}
        <Dialog
          open={statusDialog.isOpen}
          onOpenChange={(open) =>
            setStatusDialog((prev) => ({ ...prev, isOpen: open }))
          }
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{statusDialog.title}</DialogTitle>
            </DialogHeader>
            <DialogDescription>{statusDialog.message}</DialogDescription>
            <DialogFooter>
              <Button
                onClick={() =>
                  setStatusDialog((prev) => ({ ...prev, isOpen: false }))
                }
              >
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* PDF Viewer */}
        <div className="flex justify-center">
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex h-96 flex-col items-center justify-center text-gray-500">
                <Loader2 className="mb-2 h-8 w-8 animate-spin" />
                <span>Loading PDF...</span>
              </div>
            }
            error={
              <div className="flex h-96 flex-col items-center justify-center text-red-500">
                <span>Failed to load PDF</span>
                <span>Please try again later</span>
              </div>
            }
            className="flex justify-center"
          >
            <PdfPage
              pageNumber={pageNumber}
              scale={scale}
              className="shadow-lg"
            />
          </Document>
        </div>
      </div>
    </div>
  );
}
