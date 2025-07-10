interface DocumentRequirement {
  id: string;
  name: string;
  format: string;
  details: string;
  fileName?: string;
  description?: string;
  status?: "uploaded" | "missing" | "validated" | "pending_validation";
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

  analysisTemplates: { [key: string]: { value: string; label: string }[] };
  applicationTypes: { value: string; label: string }[];
  requiredDocuments: { [key: string]: DocumentRequirement[] };
  riskParametersData: { [key: string]: { [key: string]: string | number } };
}

interface StepAnalysisContextProps {
  companyName: string;
  financingValue: string;
  applicationTypeLabel: string;
  documentStatus: string;
  onBack: () => void;
  onSubmit: (aiContext: string) => void;
}

interface StepCompanyDataProps {
  companyName: string;
  setCompanyName: (name: string) => void;
  companyAddress: string;
  setCompanyAddress: (address: string) => void;
  companyPhone: string;
  setCompanyPhone: (phone: string) => void;
  yearEstablished: number | "";
  setYearEstablished: (year: number | "") => void;
  npwp: string;
  setNpwp: (npwp: string) => void;
  companyEmail: string;
  setCompanyEmail: (email: string) => void;
  businessField: string;
  setBusinessField: (field: string) => void;
  numEmployees: number | "";
  setNumEmployees: (num: number | "") => void;
  handlePreviousStep: () => void;
  handleNextStep: () => void;
  businessFields: { value: string; label: string }[];
}

interface StagedFile {
  file: File;
  key: string;
  docType: string;
}

interface DocumentUploadStepProps {
  documents: DocumentRequirement[];
  handleDocumentUpload: (docId: string, files: File[]) => void;
  handleFileRemove: (docId: string) => void;
  completenessPercentage: number;
  documentsUploadedCount: number;
  totalDocumentsRequired: number;
}
