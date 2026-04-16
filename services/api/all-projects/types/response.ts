// ────────────────────────────────────────────────────────────────────────────────
// Entity Types
// ────────────────────────────────────────────────────────────────────────────────

export interface ProjectType {
  id: number;
  name: string;
}

export interface Manager {
  id: string;
  name: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface Branch {
  id: number;
  name: string;
}

export interface Client {
  id: string;
  name: string;
}

export interface CostCenterBranch {
  id: number;
  name: string;
}

export interface Management {
  id: number;
  name: string;
}

export interface Currency {
  id: number;
  name: string;
  code: string;
}

export interface ProjectClassification {
  id: number;
  name: string;
}

export interface ProjectOwner {
  id: string;
  name: string;
  type: string;
}

// ────────────────────────────────────────────────────────────────────────────────
// Permission Settings Types
// ────────────────────────────────────────────────────────────────────────────────

export interface ProjectDataSetting {
  id: number;
  project_type_id: number;
  is_reference_number: number;
  is_name_project: number;
  is_client: number;
  is_responsible_engineer: number;
  is_number_contract: number;
  is_central_cost: number;
  is_project_value: number;
  is_start_date: number;
  is_achievement_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface AttachmentSetting {
  id: number;
  project_type_id: number;
  is_name: number;
  is_type: number;
  is_size: number;
  is_creator: number;
  is_create_date: number;
  is_downloadable: number;
  created_at: string;
  updated_at: string;
}

export interface ContractSetting {
  id: number;
  project_type_id: number;
  is_all_data_visible: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectPermissions {
  project_data_setting: ProjectDataSetting | null;
  attachment_contract_setting: AttachmentSetting | null;
  attachment_terms_contract_setting: AttachmentSetting | null;
  contractor_contract_setting: ContractSetting | null;
  employee_contract_setting: ContractSetting | null;
  department_contract_setting: ContractSetting | null;
  attachment_cycle_setting: ContractSetting | null;
  archive_library_setting: ContractSetting | null;
}

// ────────────────────────────────────────────────────────────────────────────────
// Project Data Types
// ────────────────────────────────────────────────────────────────────────────────

export interface ProjectDetails {
  id: string;
  serial_number: string;
  name: string;
  project_type_id: number;
  sub_project_type_id: number;
  sub_sub_project_type_id: number;
  manager_id: string | null;
  branch_id: number | null;
  project_owner_type: string | null;
  project_owner_id: string | null;
  contract_id: string | null;
  client_id: string | null;
  project_classification_id: number | null;
  cost_center_branch_id: number | null;
  management_id: number | null;
  currency_id: number | null;
  project_value: string;
  status: number;
  company_id: string;
  created_at: string;
  updated_at: string;
  project_type: ProjectType | null;
  sub_project_type: ProjectType | null;
  sub_sub_project_type: ProjectType | null;
  manager: Manager | null;
  branch: Branch | null;
  project_owner: ProjectOwner | null;
  project_classification: ProjectClassification | null;
  company: Company;
  client: Client | null;
  cost_center_branch: CostCenterBranch | null;
  management: Management | null;
  currency: Currency | null;
  permissions: ProjectPermissions | null;
}

export interface ProjectListItem {
  id: number;
  name: string;
  serial_number: string;
  status: number;
  project_type: ProjectType | null;
  manager: Manager | null;
  created_at: string;
  updated_at: string;
}

// ────────────────────────────────────────────────────────────────────────────────
// API Response Types
// ────────────────────────────────────────────────────────────────────────────────

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  result_count: number;
  total: number;
}

export interface ApiResponse<T> {
  code: string;
  message: string | null;
  payload: T;
  pagination?: Pagination;
}

export type ListProjectsResponse = ApiResponse<ProjectListItem[]>;
export type ShowProjectResponse = ApiResponse<ProjectDetails>;
export type CreateProjectResponse = ApiResponse<ProjectDetails>;
export type UpdateProjectResponse = ApiResponse<ProjectDetails>;
export type DeleteProjectResponse = ApiResponse<null>;
export type GetProjectTypesResponse = ApiResponse<ProjectType[]>;
export type GetBranchesResponse = ApiResponse<Branch[]>;
export type GetManagementsResponse = ApiResponse<Management[]>;
export type GetCompanyUsersResponse = ApiResponse<Manager[]>;
export type GetClientsResponse = ApiResponse<Client[]>;

export interface ProjectEmployeeUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  branch?: Branch | null;
  job_title?: string;
  jobTitle?: string;
  department?: string | null;
  department_name?: string | null;
}

/** Embedded project role on a project–employee row (`GET .../employees/project/{id}`). */
export interface ProjectEmployeeProjectRole {
  id: string;
  name: string;
  slug: string;
  is_default: boolean;
}

export interface ProjectEmployee {
  id: string;
  project_id: string;
  user: ProjectEmployeeUser;
  assigned_at?: string;
  created_at?: string;
  assigned_by?: {
    id: string;
    name: string;
  } | null;
  company?: {
    id: string;
    name: string;
  } | null;
  /** When present, employee’s project role (`GET projects/{id}/roles`). */
  project_role_id?: string | null;
  project_role?: ProjectEmployeeProjectRole | null;
}

export type GetProjectEmployeesResponse = ApiResponse<ProjectEmployee[]>;

/** Selectable employees not yet assigned to a project (`GET .../not-in-project/{id}`). */
export interface EmployeeNotInProject {
  id: string;
  name: string;
}

export type GetEmployeesNotInProjectResponse = ApiResponse<EmployeeNotInProject[]>;
