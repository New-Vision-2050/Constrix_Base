import { baseApi } from "@/config/axios/instances/base";

export type TaskStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "in_progress"
  | "paused"
  | "completed"
  | "cancelled";

export type PersonRef = { id: string; name: string; phone?: string | null };
export type LocationRef = {
  latitude: number;
  longitude: number;
  radius_meters?: number | null;
};

export type EmployeeTaskReportRow = {
  id: string;
  serial_number: string;
  title: string;
  employee: PersonRef;
  task_type: { id: string; name: string } | null;
  task_date: string;
  time_from: string;
  time_to: string;
  duration_hours: string;
  total_task_hours: string;
  status: TaskStatus;
  status_label: string;
  final_status: TaskStatus;
  final_status_label: string;
  task_location: LocationRef | null;
  created_at: string;
};

export type TaskProcessStep = {
  id: string;
  name: string;
  order: number;
  is_approve: boolean;
  status: "pending" | "approved" | "rejected";
  assigned_to: PersonRef | null;
  action_by: PersonRef | null;
  acted_at: string | null;
};

export type TaskProcess = {
  type: "create" | "start" | "end" | "approval" | "extension";
  type_label: string;
  status: string;
  status_label?: string;
  requested_by: PersonRef | null;
  requested_at: string;
  reviewed_by: PersonRef | null;
  reviewed_at: string | null;
  notes: string | null;
  review_notes?: string | null;
  location: LocationRef | null;
  additional_hours?: string | null;
  steps: TaskProcessStep[];
};

export type WorkSession = {
  id: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number;
  source: string;
  start_location: LocationRef | null;
  end_location: LocationRef | null;
  notes: string | null;
};

export type EmployeeTaskReportDetail = EmployeeTaskReportRow & {
  description: string | null;
  notes: string | null;
  rejection_reason: string | null;
  cancellation_reason: string | null;
  locations: {
    task_location: LocationRef | null;
    start_location: LocationRef | null;
    end_location: LocationRef | null;
  };
  approved_by: PersonRef | null;
  approved_at: string | null;
  rejected_by: PersonRef | null;
  rejected_at: string | null;
  cancelled_by: PersonRef | null;
  cancelled_at: string | null;
  work_sessions: WorkSession[];
  processes: TaskProcess[];
};

export type EmployeeTaskReportParams = {
  user_id?: string;
  status?: TaskStatus;
  task_date?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  per_page?: number;
  page?: number;
};

type Envelope<T> = {
  data?: T;
  payload?: T;
  pagination?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
};

export const EmployeeTasksReportApi = {
  getList: (params: EmployeeTaskReportParams) =>
    baseApi.get<Envelope<EmployeeTaskReportRow[]>>(
      "admin/employee-tasks/report",
      { params },
    ),
  getById: (id: string) =>
    baseApi.get<Envelope<EmployeeTaskReportDetail>>(
      `admin/employee-tasks/report/${id}`,
    ),
};
