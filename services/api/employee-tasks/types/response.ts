import type { Pagination } from "@/services/api/client-requests/types/response";

export interface EmployeeTaskLocation {
  latitude: number;
  longitude: number;
  radius_meters: number;
}

export interface EmployeeTaskUser {
  id: string;
  name: string;
}

export interface EmployeeTaskActionTaker {
  user_id: string;
  name: string;
}

export interface EmployeeTaskCurrentStep {
  id: number;
  name: string;
  step_order: number;
  is_approve: boolean;
  action_takers: EmployeeTaskActionTaker[];
}

export interface EmployeeTaskInboxRow {
  id: string;
  serial_number?: string;
  title?: string;
  duration_hours?: string;
  task_date?: string;
  status?: string;
  status_label?: string;
  task_location?: EmployeeTaskLocation | null;
  created_at?: string;
  user?: EmployeeTaskUser | null;
  current_step?: EmployeeTaskCurrentStep | null;
  sessions?: unknown[] | null;
}

export interface EmployeeTaskInboxListResponse {
  payload:
    | EmployeeTaskInboxRow[]
    | Record<string, EmployeeTaskInboxRow>
    | null;
  pagination?: Pagination;
  last_page?: number;
  result_count?: number;
}
