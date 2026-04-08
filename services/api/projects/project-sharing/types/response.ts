export type CompanyField = {
  id: number;
  name: string;
  description: string;
};

export type Branch = {
  id: string;
  name: string;
};

export type GeneralManager = {
  name: string;
  email: string;
  phone: string;
};

export type MainBranch = {
  name: string;
};

export type Packages = {
  id: string;
  name: string;
};
export type CompanyData = {
  id: string;
  name: string;
  name_ar: string;
  name_en: string;
  user_name: string;
  owner_id: string;
  owner_name: string;
  email: string;
  phone: string;
  serial_no: string;
  country_id: string;
  country_name: string;
  country_lat: string;
  country_long: string;
  country_iso2: string;
  company_type_id: string;
  registration_type_id: string;
  company_field_id: string;
  general_manager_id: string;
  registration_no: string;
  general_manager: GeneralManager;
  company_type: string;  
  company_field: CompanyField[];
  registration_type: string;
  logo: string;
  is_active: number;
  complete_data: number;
  date_activate: null | string;
  is_central_company: number;
  branch: string;
  main_branch: MainBranch;
  packages: Packages[];
  company_access_programs: CompanyAccessProgramsType[];
  branches: Branch[];
  created_at: string | null;
};


export type CompanyAccessProgramsType = {
  id: string;
  name: string;
};

export type ShareProjectResponse = {
  /** Present on failure; API may still return HTTP 200. */
  status?: string;
  code: string;
  message?: string | { description?: string } | null;
  payload?: unknown;
};

export type CompanyLookupResponse = {
  code: string;
  message?: string | null;
  payload: CompanyData;
};
