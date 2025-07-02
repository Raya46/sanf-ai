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

export interface CreditApplication {
  id: string;
  created_at: string;
  user_id: string;
  status: string;
  company_name: string;
  application_type: string;
  contact_person: string;
  contact_email: string;
  ai_analysis_status: string;
  probability_approval: number;
  overall_indicator: string;
  document_validation_percentage: number;
  estimated_analysis_time_minutes: number;
  revenue: RevenueData[];
  application_files: ApplicationFile[];
}
