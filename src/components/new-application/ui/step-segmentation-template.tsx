"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  analysisTemplates,
  applicationTypes,
  requiredDocuments,
  riskParametersData,
} from "@/data/analyze-data-template";
import { Edit, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface DocumentRequirement {
  id: string;
  name: string;
  format: string;
  details: string;
  status: "uploaded" | "missing" | "validated" | "pending_validation";
}

interface StepSegmentationTemplateProps {
  applicationType: string;
  setApplicationType: (type: string) => void;
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  riskParameters: { [key: string]: number | string };
  setRiskParameters: React.Dispatch<
    React.SetStateAction<{ [key: string]: number | string }>
  >;
  onDocumentsChange: (docs: DocumentRequirement[]) => void;
}

export function StepSegmentationTemplate({
  applicationType,
  setApplicationType,
  selectedTemplate,
  setSelectedTemplate,
  riskParameters,
  setRiskParameters,
  onDocumentsChange,
}: StepSegmentationTemplateProps) {
  const [isEditingDocs, setIsEditingDocs] = useState(false);
  const [isEditingParams, setIsEditingParams] = useState(false);
  const [editableDocs, setEditableDocs] = useState<DocumentRequirement[]>([]);
  const [editableParams, setEditableParams] = useState<
    [string, string | number][]
  >([]);

  // State untuk data custom yang dibuat pengguna
  const [customApplicationTypes, setCustomApplicationTypes] =
    useState(applicationTypes);
  const [customAnalysisTemplates, setCustomAnalysisTemplates] =
    useState(analysisTemplates);

  useEffect(() => {
    const docsTemplate = requiredDocuments[selectedTemplate] || [];
    setEditableDocs(JSON.parse(JSON.stringify(docsTemplate)));

    const paramsTemplate = riskParametersData[selectedTemplate] || {};
    setEditableParams(Object.entries(paramsTemplate));
    setRiskParameters(paramsTemplate);
  }, [selectedTemplate, setRiskParameters]);

  useEffect(() => {
    onDocumentsChange(editableDocs);
  }, [editableDocs, onDocumentsChange]);

  const handleDocChange = (
    index: number,
    field: keyof Omit<DocumentRequirement, "id" | "status">,
    value: string
  ) => {
    const newDocs = [...editableDocs];
    (newDocs[index] as any)[field] = value;
    setEditableDocs(newDocs);
  };
  const handleAddDoc = () => {
    setEditableDocs([
      ...editableDocs,
      { id: uuidv4(), name: "", format: "PDF", details: "", status: "missing" },
    ]);
  };
  const handleDeleteDoc = (id: string) => {
    setEditableDocs(editableDocs.filter((doc) => doc.id !== id));
  };

  const handleParamChange = (
    index: number,
    part: "key" | "value",
    value: string
  ) => {
    const newParams = [...editableParams];
    if (part === "key") newParams[index][0] = value;
    else newParams[index][1] = value;
    setEditableParams(newParams);
  };
  const handleAddParam = () => {
    setEditableParams([...editableParams, ["ParameterBaru", ""]]);
  };
  const handleDeleteParam = (keyToDelete: string) => {
    setEditableParams(editableParams.filter(([key]) => key !== keyToDelete));
  };
  const handleSaveParams = () => {
    const newParamsObject = Object.fromEntries(editableParams);
    setRiskParameters(newParamsObject);
    setIsEditingParams(false);
  };

  // ... (Handler untuk menambah segment/template baru tetap sama)

  return (
    <div className="flex w-full flex-1 gap-6">
      {/* Kolom Kiri: Area Input dan Edit */}
      <div className="flex w-1/2 flex-col gap-6">
        <Card className="bg-slate-50/50">
          <CardHeader>
            <CardTitle>1. Segmentasi & Template</CardTitle>
            <CardDescription>
              Pilih atau buat segmentasi dan template analisis.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label>Pilih Segment</Label>
              <Select
                onValueChange={(value) => {
                  setApplicationType(value);
                  setSelectedTemplate("");
                }}
                value={applicationType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Segment" />
                </SelectTrigger>
                <SelectContent>
                  {customApplicationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {applicationType && (
              <div className="space-y-2">
                <Label>Pilih Template Dokumen</Label>
                <Select
                  onValueChange={setSelectedTemplate}
                  value={selectedTemplate}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Template Dokumen" />
                  </SelectTrigger>
                  <SelectContent>
                    {customAnalysisTemplates[applicationType]?.map(
                      (template) => (
                        <SelectItem key={template.value} value={template.value}>
                          {template.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedTemplate && (
          <Card className="bg-slate-50/50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>2. Dokumen Wajib</CardTitle>
                  <CardDescription>
                    Kustomisasi daftar dokumen yang dibutuhkan.
                  </CardDescription>
                </div>
                {!isEditingDocs && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingDocs(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Ubah
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {isEditingDocs ? (
                <>
                  {editableDocs.map((doc, index) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-2 p-2 border rounded-md bg-white"
                    >
                      <Input
                        value={doc.name}
                        onChange={(e) =>
                          handleDocChange(index, "name", e.target.value)
                        }
                        placeholder="Nama Dokumen"
                        className="font-medium"
                      />
                      <Input
                        value={doc.format}
                        onChange={(e) =>
                          handleDocChange(index, "format", e.target.value)
                        }
                        placeholder="Format"
                        className="w-24"
                      />
                      <Input
                        value={doc.details}
                        onChange={(e) =>
                          handleDocChange(index, "details", e.target.value)
                        }
                        placeholder="Detail"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteDoc(doc.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex justify-between mt-2">
                    <Button variant="outline" size="sm" onClick={handleAddDoc}>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Dokumen
                    </Button>
                    <Button size="sm" onClick={() => setIsEditingDocs(false)}>
                      <Save className="h-4 w-4 mr-2" />
                      Simpan
                    </Button>
                  </div>
                </>
              ) : (
                editableDocs.map((doc) => (
                  <div key={doc.id} className="flex items-center space-x-3">
                    <Checkbox id={doc.id} checked disabled />
                    <div>
                      <Label htmlFor={doc.id}>{doc.name}</Label>
                      <p className="text-xs text-gray-500">
                        Format: {doc.format} - {doc.details}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {selectedTemplate && (
          <Card className="bg-slate-50/50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>3. Parameter Risiko</CardTitle>
                  <CardDescription>
                    Atur parameter risiko sesuai kebijakan kredit.
                  </CardDescription>
                </div>
                {!isEditingParams && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingParams(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Ubah
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {isEditingParams ? (
                <>
                  {editableParams.map(([key, value], index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={key}
                        onChange={(e) =>
                          handleParamChange(index, "key", e.target.value)
                        }
                        placeholder="Nama Parameter"
                        className="font-semibold capitalize"
                      />
                      <Input
                        value={String(value)}
                        onChange={(e) =>
                          handleParamChange(index, "value", e.target.value)
                        }
                        placeholder="Nilai"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteParam(key)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex justify-between mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddParam}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Parameter
                    </Button>
                    <Button size="sm" onClick={handleSaveParams}>
                      <Save className="h-4 w-4 mr-2" />
                      Simpan Perubahan
                    </Button>
                  </div>
                </>
              ) : (
                Object.entries(riskParameters).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between text-sm"
                  >
                    <Label className="capitalize text-gray-600">
                      {key.replace(/([A-Z])/g, " $1").trim()}:
                    </Label>
                    <span className="font-medium">{String(value)}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Kolom Kanan: Area Preview (Hanya Baca) */}
      {selectedTemplate && (
        <div className="w-1/2">
          <Card className="bg-white sticky top-6">
            <CardHeader>
              <CardTitle>Preview Template</CardTitle>
              <CardDescription>
                Ini adalah ringkasan dari template yang sedang Anda konfigurasi
                di sebelah kiri.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="mb-2 text-lg font-bold">
                {
                  customAnalysisTemplates[applicationType]?.find(
                    (t) => t.value === selectedTemplate
                  )?.label
                }
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Last updated:{" "}
                {new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <h4 className="mb-2 mt-4 text-md font-semibold">
                Dokumen Wajib:
              </h4>
              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                {editableDocs.map((doc) => (
                  <li key={doc.id}>
                    {doc.name || (
                      <span className="italic text-gray-400">
                        [Nama Dokumen Kosong]
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              <h4 className="mb-2 mt-6 text-md font-semibold">
                Parameter Risiko:
              </h4>
              <div className="space-y-1 text-sm">
                {Object.entries(riskParameters).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <p className="capitalize text-gray-600">
                      {key.replace(/([A-Z])/g, " $1").trim()}:
                    </p>
                    <p className="font-medium">{String(value)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
