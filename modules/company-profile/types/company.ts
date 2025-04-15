export interface CompanyDocumentLog {
  id: string;
  action: string;
  date: string;
  user: string;
}

export interface CompanyDocument {
  id: string;
  name: string;
  file: string[];
  description: string;
  document_number: string;
  start_date: string;
  end_date: string;
  notification_date: string;
  document_type_id: string;
  logs: CompanyDocumentLog[];
}

export interface CompanyBranch {
  name: string | null;
}

export interface CompanyData {
  id: string;
  name: string;
  name_ar: string;
  name_en: string;
  user_name: string;
  email: string;
  phone: string;
  serial_no: string;
  country_id: string;
  company_type_id: string;
  company_field_id: string;
  registration_type_id: string;
  general_manager_id: string;
  registration_no: string | null;
  general_manager_name: string;
  company_type: string;
  company_field: string;
  registration_type: string;
  logo: string;
  is_active: number;
  complete_data: number;
  date_activate: string | null;
  is_central_company: number;
  main_branch: CompanyBranch;
  company_legal_data: any[];
  company_official_documents: CompanyDocument[];
}
