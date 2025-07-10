export interface RevenueData {
  year: number;
  month: number;
  revenue: number;
}

export interface ApplicationFile {
  id: string;
  file_name: string;
  r2_object_key: string;
  file_type: string;
}

export interface ChatMessage {
  id: string;
  sender_type: "user" | "ai";
  message_content: string;
}

export interface KeyRatioData {
  ratio: number;
  target: number;
}

export interface CreditApplication {
  id: string;
  created_at: string;
  user_id: string;
  status: string;
  analysis_template: string;
  risk_appetite: number;
  company_type: string; // New field
  amount: number; // New field
  ai_analysis_status: string;
  probability_approval: number;
  overall_indicator: string;
  document_validation_percentage: number;
  estimated_analysis_time_minutes: number;
  revenue: RevenueData[];
  gross_profit: number;
  operating_expenses: number;
  ebitda: number;
  application_files: ApplicationFile[];
  ai_analysis?: string; // New field for the full AI analysis report
  key_ratios?: Record<string, KeyRatioData>; // New field for key ratios
}
