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
  name: string | null;
  step_order: number | null;
  is_approve: boolean;
  action_takers: EmployeeTaskActionTaker[];
}

export interface EmployeeTaskSummary {
  notes: string | null;
  attachment_path: string | null;
  time_from: string | null;
  time_to: string | null;
  total_task_hours: string | number | null;
}

export interface EmployeeTaskTask {
  id: string;
  serial_number?: string;
  status?: string;
  status_label?: string;
  task_date?: string;
  title?: string;
}

export interface EmployeeTaskInboxRow {
  id: string;
  type?: string;
  type_label?: string;
  status?: string;
  created_at?: string;
  /** New API: employee info */
  employee?: EmployeeTaskUser | null;
  /** New API: nested task details */
  task?: EmployeeTaskTask | null;
  /** New API: task completion summary */
  summary?: EmployeeTaskSummary | null;
  current_step?: EmployeeTaskCurrentStep | null;
  /** Legacy fields – kept for backward compatibility */
  serial_number?: string;
  title?: string;
  duration_hours?: string;
  task_date?: string;
  status_label?: string;
  task_location?: EmployeeTaskLocation | null;
  user?: EmployeeTaskUser | null;
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

export interface EmployeeTaskProcedure {
  id: string;
  step_number: number;
  name: string;
  icon: string | null;
  percentage: number;
  form: string;
  taken_by: { id: string; name: string } | null;
  taken_at: string | null;
}

export interface EmployeeTaskProceduresSummary {
  total: number;
  last_action: string | null;
  start_date: string | null;
  progress: number;
}

export interface EmployeeTaskProceduresPayload {
  items: EmployeeTaskProcedure[];
  summary: EmployeeTaskProceduresSummary;
}

export interface EmployeeTaskProceduresResponse {
  payload: EmployeeTaskProceduresPayload | null;
}
