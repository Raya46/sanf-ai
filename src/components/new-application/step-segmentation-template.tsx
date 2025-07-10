"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useEffect } from "react";

interface DocumentRequirement {
  id: string;
  name: string;
  format: string;
  details: string;
  fileName?: string;
  description?: string;
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
  handleNextStep: () => void;
  analysisTemplates: { [key: string]: { value: string; label: string }[] };
  applicationTypes: { value: string; label: string }[];
  requiredDocuments: { [key: string]: DocumentRequirement[] };
  riskParametersData: { [key: string]: { [key: string]: string | number } };
}

export function StepSegmentationTemplate({
  applicationType,
  setApplicationType,
  selectedTemplate,
  setSelectedTemplate,
  riskParameters,
  setRiskParameters,
  handleNextStep,
  analysisTemplates,
  applicationTypes,
  requiredDocuments,
  riskParametersData,
}: StepSegmentationTemplateProps) {
  useEffect(() => {
    if (selectedTemplate && riskParametersData[selectedTemplate]) {
      setRiskParameters(riskParametersData[selectedTemplate]);
    } else {
      setRiskParameters({});
    }
  }, [selectedTemplate, riskParametersData, setRiskParameters]);

  const handleRiskParameterChange = (key: string, value: string | number) => {
    setRiskParameters((prev: { [key: string]: number | string }) => ({
      ...prev,
      [key]: value,
    }));
  };

  const currentTemplateData = selectedTemplate
    ? analysisTemplates[applicationType]?.find(
        (template) => template.value === selectedTemplate
      )
    : null;

  const currentRequiredDocuments = selectedTemplate
    ? requiredDocuments[selectedTemplate] || []
    : [];

  const currentRiskParameters = selectedTemplate
    ? riskParametersData[selectedTemplate]
    : null;

  return (
    <>
      <div className="flex gap-4 w-full flex-1">
        {/* Left Column */}
        <div className="flex flex-col gap-4 w-1/2">
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Segmentasi & Template Dokumen</CardTitle>
            </CardHeader>
            <div className="flex flex-col gap-4 p-4">
              <p>Pilih Segment:</p>
              <Select
                onValueChange={setApplicationType}
                value={applicationType}
              >
                <SelectTrigger
                  className="w-full"
                  aria-label="Select application type"
                >
                  <SelectValue placeholder="Pilih Segment" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {applicationTypes.map((type) => (
                    <SelectItem
                      key={type.value}
                      value={type.value}
                      className="rounded-lg"
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {applicationType && (
                <>
                  <p>Pilih Template Dokumen:</p>
                  <Select
                    onValueChange={setSelectedTemplate}
                    value={selectedTemplate}
                  >
                    <SelectTrigger
                      className="w-full"
                      aria-label="Select analysis template"
                    >
                      <SelectValue placeholder="Pilih Template Dokumen" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {analysisTemplates[applicationType]?.map((template) => (
                        <SelectItem
                          key={template.value}
                          value={template.value}
                          className="rounded-lg"
                        >
                          {template.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}

              {selectedTemplate && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Dokumen Wajib:</h3>
                  <div className="flex flex-col gap-2">
                    {currentRequiredDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox id={`doc-${index}`} checked={true} disabled />
                        <Label htmlFor={`doc-${index}`}>{doc.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {selectedTemplate && currentRiskParameters && (
            <Card className="p-4 mt-4">
              <CardHeader>
                <CardTitle>Parameter Risiko</CardTitle>
              </CardHeader>
              <div className="flex flex-col gap-4 p-4">
                {Object.entries(currentRiskParameters).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}:
                    </Label>
                    <Input
                      type={typeof value === "number" ? "number" : "text"}
                      value={riskParameters[key] || ""}
                      onChange={(e) =>
                        handleRiskParameterChange(key, e.target.value)
                      }
                      className="w-1/2"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - Preview Template */}
        {selectedTemplate && currentTemplateData && currentRiskParameters && (
          <div className="w-1/2">
            <Card className="p-4">
              <CardHeader>
                <CardTitle>Preview Template</CardTitle>
              </CardHeader>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">
                  {currentTemplateData.label}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Last updated: 05 Juli 2025
                </p>

                <h4 className="text-lg font-semibold mb-2">Dokumen Wajib:</h4>
                <ul className="list-decimal pl-5 mb-4">
                  {currentRequiredDocuments.map((doc, index) => (
                    <li key={index}>
                      {doc.name} &rarr; {doc.description}
                    </li>
                  ))}
                </ul>

                <h4 className="text-lg font-semibold mb-2">
                  Parameter Risiko:
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(riskParameters).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <p className="capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}:
                      </p>
                      <p>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <Button
          onClick={handleNextStep}
          disabled={!applicationType || !selectedTemplate}
        >
          Next
        </Button>
      </div>
    </>
  );
}
