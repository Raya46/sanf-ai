export interface DocumentRequirement {
  id: string;
  name: string;
  format: string;
  details: string;
  status: "uploaded" | "missing" | "validated" | "pending_validation";
}

export interface StepSegmentationTemplateProps {
  applicationType: string;
  setApplicationType: (type: string) => void;
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  riskParameters: { [key: string]: number | string };
  setRiskParameters: React.Dispatch<
    React.SetStateAction<{ [key: string]: number | string }>
  >;
  onDocumentsChange: (docs: DocumentRequirement[]) => void;
  // Props baru untuk data yang bisa dikustomisasi
  customApplicationTypes: { value: string; label: string }[];
  setCustomApplicationTypes: React.Dispatch<
    React.SetStateAction<{ value: string; label: string }[]>
  >;
  customAnalysisTemplates: {
    [key: string]: { value: string; label: string }[];
  };
  setCustomAnalysisTemplates: React.Dispatch<
    React.SetStateAction<{ [key: string]: { value: string; label: string }[] }>
  >;
  // Props untuk data awal
  requiredDocuments: { [key: string]: DocumentRequirement[] };
  riskParametersData: { [key: string]: { [key: string]: string | number } };
}

export interface StepAnalysisContextProps {
  companyName: string;
  amountSubmission: number;
  applicationTypeLabel: string;
  documentStatus: string;
  onContextChange: (context: string) => void;
  onAmountSubmissionChange: (value: number) => void;
  aiContext: string;
}

export interface StepCompanyDataProps {
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
  contactEmail: string;
  setContactEmail: (email: string) => void;
  businessField: string;
  setBusinessField: (field: string) => void;
  amountSubmissions: number;
  setamountSubmission: (num: number) => void;
  businessFields: { value: string; label: string }[];
}
