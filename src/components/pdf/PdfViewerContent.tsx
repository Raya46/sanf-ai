"use client";

import { Document, Page as PdfPage, pdfjs } from "react-pdf";
import { Loader2 } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Setup worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerContentProps {
    pdfFile: string;
    pageNumber: number;
    scale: number;
    onDocumentLoadSuccess: (data: { numPages: number }) => void;
    onDocumentLoadError: (error: Error) => void;
}

export default function PdfViewerContent({
    pdfFile,
    pageNumber,
    scale,
    onDocumentLoadSuccess,
    onDocumentLoadError,
}: PdfViewerContentProps) {
    return (
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
    );
}
