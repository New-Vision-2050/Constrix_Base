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

/** Company the project is shared with (list payload). */
export type ProjectShareWithCompany = {
  id: string;
  name: string;
  serial_number: string | null;
  email?: string;
  phone?: string;
};

export type ProjectShareActor = {
  id: string;
  name: string;
};

/**
 * Row from `projects/sharing/list` (and related) list endpoints.
 * Nested objects may be omitted on some rows — map with optional chaining in UI.
 */
export type ProjectShareAssignment = {
  id: string;
  created_at: string;
  updated_at?: string;
  notes?: string | null;
  status: string;
  schema_ids?: number[];
  shareable_id?: string;
  shareable_type?: string;
  responded_at?: string | null;
  responded_by?: ProjectShareActor | null;
  owner_company?: { id: string; name: string; serial_number?: string | null } | null;
  shared_by?: ProjectShareActor | null;
  shared_with_company?: ProjectShareWithCompany | null;
  /** Legacy/alternate shape from older API versions */
  user?: { id: string; name: string; email?: string } | null;
  assigned_at?: string;
  assigned_by?: { id: string; name: string } | null;
};

export type ListProjectSharesResponse = {
  code: string;
  message?: string | null;
  payload: ProjectShareAssignment[];
};

/** Nested project on a pending share invitation (fields vary by API). */
export type PendingInvitationProject = {
  id?: string | number;
  serial_number?: string;
  ref_number?: string;
  name?: string;
  contract_number?: string;
  start_date?: string;
  end_date?: string;
  completion_percentage?: number;
  delay_percentage?: number;
  status?: number;
  project_view?: string;
  project_type_name?: string;
  sub_project_type?: string;
  sub_project_type_name?: string;
  sub_sub_project_type_name?: string;
  branch_name?: string;
  management_name?: string;
  manager_name?: string;
  project_owner_name?: string;
  client_name?: string;
  responsible_employee?: { id?: number; name?: string };
  responsible_employee_name?: string;
  client?: { name?: string };
  [key: string]: unknown;
};

export type PendingShareInvitation = {
  id: string;
  status: string;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  shareable_id?: string;
  shareable_type?: string;
  /** Shared section IDs (same as project share / schema_ids). */
  schema_ids?: number[];
  /** Company that initiated the share (when present on the API). */
  owner_company?: { id?: string; name?: string; serial_number?: string | null } | null;
  /** Company that the project is shared with. */
  shared_with_company?: { id?: string; name?: string; serial_number?: string | null } | null;
  shared_by?: { id?: string; name?: string } | null;
  responded_by?: { id?: string; name?: string } | null;
  responded_at?: string | null;
  project?: PendingInvitationProject | null;
};

export type PendingInvitationsResponse = {
  code: string;
  message?: string | null;
  payload: PendingShareInvitation[];
};

export type SharedCompany = {
  id: string;
  name: string;
  serial_number?: string | null;
  email?: string;
  phone?: string;
};

export type GetSharedCompaniesResponse = {
  code: string;
  message?: string | null;
  payload: SharedCompany[];
};
