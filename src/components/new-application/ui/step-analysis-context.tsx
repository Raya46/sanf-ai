"use client";

import { Info, Lock } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { promptSuggestions } from "@/data/analyze-data-template";

export function StepAnalysisContext({
  companyName,
  financingValue,
  applicationTypeLabel,
  documentStatus,
}: StepAnalysisContextProps) {
  const [aiContext, setAiContext] = useState("");

  return (
    <div className="flex w-full flex-col gap-6">
      <Alert className="border-blue-200 bg-blue-50 text-blue-800">
        <Info className="h-4 w-4" color="#3b82f6" />
        <AlertTitle className="font-semibold">Petunjuk Penggunaan</AlertTitle>
        <AlertDescription>
          Berikan instruksi ke AI untuk memfokuskan analisis kredit pada aspek
          tertentu sesuai kebutuhan. Konteks ini akan disimpan sebagai bagian
          dari jejak audit pengajuan.
        </AlertDescription>
      </Alert>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Input Konteks Analisis untuk AI</CardTitle>
          <p className="text-sm text-gray-500">
            Berikan arahan khusus kepada AI untuk memfokuskan analisis pada
            aspek-aspek tertentu dari pengajuan {companyName}.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bagian Informasi Pengajuan */}
          <div className="rounded-lg border bg-slate-50/50 p-4">
            <h3 className="mb-4 font-semibold text-gray-800">
              Informasi Pengajuan
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <Label className="text-xs text-gray-500">Nama Perusahaan</Label>
                <p className="font-medium">{companyName}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">
                  Jenis Pembiayaan
                </Label>
                <p className="font-medium">{applicationTypeLabel}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">
                  Nilai Pembiayaan
                </Label>
                <p className="font-medium">{financingValue}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Dokumen</Label>
                <p className="font-medium">{documentStatus}</p>
              </div>
            </div>
          </div>

          {/* Bagian Input Konteks AI */}
          <div>
            <Label htmlFor="ai-context" className="font-semibold text-gray-800">
              Input Konteks untuk AI
            </Label>
            <Textarea
              id="ai-context"
              value={aiContext}
              onChange={(e) => setAiContext(e.target.value)}
              placeholder="Contoh: Lakukan analisa yang mendalam terhadap aplikasi pengajuan ini, fokus pada kemampuan cashflow bulanan dan kevalidan kerjasama dengan bohir. Perhatikan juga apakah proyek yang tertera dalam invoice benar-benar mendukung arus kas selama tenor berjalan."
              className="mt-2 min-h-[120px]"
            />
          </div>

          {/* Bagian Contoh Prompt */}
          <div>
            <Label className="font-semibold text-gray-800">Contoh Prompt</Label>
            <div className="mt-2 space-y-2">
              {promptSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="flex items-center space-x-2"
                >
                  <Checkbox id={suggestion.id} />
                  <Label
                    htmlFor={suggestion.id}
                    className="text-sm font-normal text-gray-600"
                  >
                    {suggestion.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Bagian Catatan */}
          <div className="flex items-center gap-3 rounded-lg border-l-4 border-blue-500 bg-slate-50 p-3 text-sm text-gray-600">
            <Lock className="h-5 w-5 flex-shrink-0" />
            <p>
              Konteks yang dimasukkan akan disimpan dalam sistem sebagai bagian
              dari jejak audit pengajuan untuk keperluan dokumentasi dan
              pemantauan model AI.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
