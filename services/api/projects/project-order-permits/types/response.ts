export interface ProjectOrderPermitTypeDto {
  id: number;
  project_type_id: number;
  code: string;
  description: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface ListProjectOrderPermitTypesResponse {
  code: string;
  message: string | null;
  payload: ProjectOrderPermitTypeDto[];
}

export interface ProjectOrderPermitDepartmentDto {
  id: number;
  project_type_id: number;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ListProjectOrderPermitDepartmentsResponse {
  code: string;
  message: string | null;
  payload: ProjectOrderPermitDepartmentDto[];
}

export interface ProjectOrderPermitContractorDto {
  id?: string | number | null;
  name?: string | null;
  contractor_name?: string | null;
}

export interface ProjectOrderPermitNestedDto {
  id?: number | null;
  type?: string | null;
  description?: string | null;
  code?: string | null;
}

export interface ProjectOrderPermitStateDto {
  id?: string | number | null;
  name?: string | null;
}

export interface ProjectOrderPermitWorkOrderDto {
  id: string | number;
  name?: string | null;
  type?: string | null;
  assigned_date?: string | null;
  order_permit_id?: number | null;
  order_permit_department_id?: number | null;
  contractor_id?: string | null;
  contractor_name?: string | null;
  state_id?: string | number | null;
  state_name?: string | null;
  lat?: number | string | null;
  long?: number | string | null;
  price?: number | string | null;
  contract_code?: string | null;
  client_code?: string | null;
  station_code?: string | null;
  station_name?: string | null;
  governorate?: string | null;
  contracting_party?: string | null;
  indebtedness?: number | string | null;
  representative?: string | null;
  supervisor?: string | null;
  guidance_and_regions?: string | null;
  route?: string | null;
  default_value?: number | string | null;
  available_balance?: number | string | null;
  cash_balance?: number | string | null;
  pos_machines_count?: number | string | null;
  pc_machines_count?: number | string | null;
  total_machines_count?: number | string | null;
  cashier?: string | null;
  sim_lines_count?: number | string | null;
  pc_sim_lines_count?: number | string | null;
  total_lines_count?: number | string | null;
  bank?: string | null;
  bank_account_number?: string | null;
  bank_client_code?: string | null;
  bank_account_name?: string | null;
  collection_party?: string | null;
  payment_type?: string | null;
  payment_method?: string | null;
  value?: number | string | null;
  payment_status?: string | null;
  active?: boolean | number | null;
  is_active?: boolean | number | null;
  block?: string | null;
  updated_at?: string | null;
  updated_by?: string | null;
  updated_by_user?: string | null;
  contractor?: ProjectOrderPermitContractorDto | null;
  order_permit?: ProjectOrderPermitNestedDto | null;
  order_permit_department?: ProjectOrderPermitNestedDto | null;
  state?: ProjectOrderPermitStateDto | null;
}

export interface ListProjectOrderPermitsResponse {
  code: string;
  message: string | null;
  payload: ProjectOrderPermitWorkOrderDto[];
}

export interface CreateProjectOrderPermitsResponse {
  code: string;
  message: string | null;
  payload?: unknown;
}
