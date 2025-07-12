"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { promptSuggestions } from "@/data/analyze-data-template";
import { StepAnalysisContextProps } from "@/type/step-type";
import { Info, Lock } from "lucide-react";
import { useState } from "react";

export function StepAnalysisContext({
  companyName,
  amountSubmission,
  applicationTypeLabel,
  documentStatus,
  aiContext,
  onContextChange,
  onAmountSubmissionChange,
}: StepAnalysisContextProps) {
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);

  const handleCheckboxChange = (suggestionId: string, checked: boolean) => {
    const suggestion = promptSuggestions.find((s) => s.id === suggestionId);
    if (!suggestion) return;

    let newSelectedPrompts;
    if (checked) {
      newSelectedPrompts = [...selectedPrompts, suggestionId];
    } else {
      newSelectedPrompts = selectedPrompts.filter((id) => id !== suggestionId);
    }
    setSelectedPrompts(newSelectedPrompts);

    // Build new context text
    const selectedSuggestions = promptSuggestions
      .filter((s) => newSelectedPrompts.includes(s.id))
      .map((s) => s.label);

    const newContext = selectedSuggestions.join("\n\n");
    onContextChange(newContext);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <Alert className="border-[#182d7c] bg-indigo-100/50 text-[#182d7c]">
        <Info className="h-4 w-4" color="#182d7c" />
        <AlertTitle className="font-semibold">Petunjuk Penggunaan</AlertTitle>
        <AlertDescription>
          Berikan instruksi ke AI untuk memfokuskan analisis kredit pada aspek
          tertentu sesuai kebutuhan. Konteks ini akan disimpan sebagai bagian
          dari jejak audit pengajuan.
        </AlertDescription>
      </Alert>

      <Card className="w-full bg-blue-50/50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-[#182d7c]">
            Input Konteks Analisis untuk AI
          </CardTitle>
          <p className="text-sm text-gray-500">
            Berikan arahan khusus kepada AI untuk memfokuskan analisis pada
            aspek-aspek tertentu dari pengajuan {companyName}.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bagian Informasi Pengajuan */}
          <div className="rounded-lg border bg-white p-4">
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
                  Nominal Pengajuan
                </Label>
                <p className="font-medium">{amountSubmission}</p>
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
              onChange={(e) => onContextChange(e.target.value)}
              placeholder="Contoh: Lakukan analisa yang mendalam terhadap aplikasi pengajuan ini, fokus pada kemampuan cashflow bulanan dan kevalidan kerjasama dengan bohir. Perhatikan juga apakah proyek yang tertera dalam invoice benar-benar mendukung arus kas selama tenor berjalan."
              className="mt-2 min-h-[120px] bg-white"
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
                  <Checkbox
                    id={suggestion.id}
                    checked={selectedPrompts.includes(suggestion.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(suggestion.id, checked as boolean)
                    }
                  />
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
          <div className="flex items-center gap-3 rounded-lg border-l-4 border-blue-500 bg-white p-3 text-sm text-gray-600">
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
