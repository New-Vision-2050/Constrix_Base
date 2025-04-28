export interface CompanyDocumentLog {
  id: string;
  action: string;
  date: string;
  user: string;
}

export interface CompanyLegalData {
  id: string;
  registration_number: string;
  registration_type: string;
  registration_type_id: string;
  start_date: string;
  end_date: string;
  file: string;
}

export interface CompanyDocument {
  id: string;
  name: string;
  files: {
    id: number;
    mime_type: string;
    name: string;
    url: string;
  }[];
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

export interface GeneralManager {
  name: string;
  email: string;
  phone: string;
  nationality: string;
}

export interface MainBranch {
  name: string;
}

export interface CompanyAddress {
  id: string;
  company_id: string;
  country_id: string;
  country_iso2: string;
  country_lat: string;
  country_long: string;
  city_id: string | null;
  state_id: string | null;
  neighborhood_name: string | null;
  street_name: string | null;
  building_number: string | null;
  additional_phone: string | null;
  postal_code: string | null;
  created_at: string;
  updated_at: string;
  management_hierarchy_id: string;
  country_name: string;
  state_name: string | null;
  city_name: string | null;
}

export interface Branch {
  id: string;
  parent_id: null | string;
  name: string;
  phone: null | string;
  phone_code: null | string;
  email: null | string;
  lattitude: null | string;
  longitude: null | string;
  country_id: string;
  state_id: null | string;
  city_id: null | string;
  country_name: string;
  state_name: null | string;
  city_name: null | string;
  manager: Manager | null
  user_count:string | Number
  department_count:string | Number
}

export interface Manager {
    id: string;
    email: null | string;
    name: string;
    phone: null | string;
}

export interface officialData {
  branch: string;
  name: string;
  name_en: string;
  company_type: string;
  company_type_id: string;
  country_name: string;
  country_id: string;
  company_field: {
    id: number;
    name: string;
    description: string;
  }[];
  company_field_id: string;
  phone: string;
  email: string;
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
  country_name: string;
  company_type_id: string;
  company_field_id: string;
  registration_type_id: string;
  general_manager_id: string;
  registration_no: null | string;
  general_manager: GeneralManager;
  company_type: string;
  company_field: {
    id: number;
    name: string;
    description: string;
  }[];
  registration_type: string;
  logo: string;
  is_active: number;
  complete_data: number;
  date_activate: null | string;
  is_central_company: number;
  branch: string;
  main_branch: MainBranch;
  company_legal_data: CompanyLegalData[] | [];
  company_address: CompanyAddress;
  company_official_documents: CompanyDocument[] | [];
  branches: Branch[];
  created_at: string | null;
}
