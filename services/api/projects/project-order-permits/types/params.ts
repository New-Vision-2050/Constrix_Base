export interface CreateProjectOrderPermitWorkOrderArgs {
  name: string;
  type: string;
  assigned_date: string;
  contractor_id: string;
  price: number;
  order_permit_id?: number;
  order_permit_department_id?: number;
  project_management_id?: number;
  projects_district_id?: number;
  state_id?: string;
  lat?: number;
  long?: number;
}

export interface CreateProjectOrderPermitsArgs {
  project_id: string;
  work_orders: CreateProjectOrderPermitWorkOrderArgs[];
}

export interface ListProjectOrderPermitsParams {
  order_permit_department_id?: number;
}

export interface ListOrderPermitTypesParams {
  name?: string;
}

export interface ListUdsWorkOrdersParams {
  name: string;
  order_permit_id: number | string;
}

export interface UpdateProjectOrderPermitArgs {
  permit_status_id?: number | null;
  start_permit_date?: string | null;
  end_permit_date?: string | null;
  note_from_permit_to_departments?: string | null;
  note_from_departments_to_permit?: string | null;
  is_taked_action?: boolean | number | null;
  count_of_days_from_assigned_date?: number | string | null;
  evaluation_permit_status?: string | null;
  employee_id?: string | number | null;
}
