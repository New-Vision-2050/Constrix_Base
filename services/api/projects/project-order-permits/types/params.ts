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
