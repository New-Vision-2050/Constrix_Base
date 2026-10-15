import { baseApi } from "@/config/axios/instances/base";

export type RequestStatus = "pending" | "approved" | "rejected" | "cancelled";
export type StepStatus = "pending" | "approved" | "rejected";
export type ProcessStatus = "pending" | "in_progress" | "completed" | "failed";

export type PersonRef = { id: string; name: string; phone?: string | null };
export type NamedRef = { id: string; name: string };

export type RequestWorkflow = {
  auto_approved: boolean;
  process_status: ProcessStatus | null;
  process_status_label: string | null;
  current_step: {
    name: string;
    order: number;
    action_takers: NamedRef[];
  } | null;
};

type BaseRow = {
  id: string;
  employee: PersonRef | null;
  reason: string | null;
  status: RequestStatus;
  status_label: string;
  workflow: RequestWorkflow;
  created_at: string;
};

export type LeaveReportRow = BaseRow & {
  leave_policy: NamedRef | null;
  leave_type: NamedRef | null;
  start_date: string;
  end_date: string;
  total_days: number;
  is_emergency: boolean;
};

export type AdvanceReportRow = BaseRow & {
  advance_policy: NamedRef | null;
  amount: number;
  installments: number;
};

export type WorkflowStep = {
  id: string;
  name: string;
  order: number;
  is_approve: boolean;
  status: StepStatus;
  status_label: string;
  action: "approve" | "reject" | null;
  action_label: string | null;
  assigned_to: PersonRef | null;
  authorized_users: NamedRef[];
  action_by: PersonRef | null;
  acted_at: string | null;
};

export type WorkflowProcess = {
  id: string;
  form: string;
  form_label: string;
  status: ProcessStatus;
  status_label: string;
  steps: WorkflowStep[];
};

export type TimelineItem = {
  process_id: string;
  step_name: string;
  step_order: number;
  action: "approve" | "reject";
  action_label: string;
  action_by: PersonRef;
  acted_at: string;
};

export type AttachmentRef = {
  id?: string;
  name?: string | null;
  url: string;
  type?: string | null;
};

type DetailExtras = {
  notes: string | null;
  attachments: AttachmentRef[];
  rejection_reason: string | null;
  requested_by: PersonRef | null;
  approved_by: PersonRef | null;
  approved_at: string | null;
  rejected_by: PersonRef | null;
  rejected_at: string | null;
  processes: WorkflowProcess[];
  timeline: TimelineItem[];
};

export type LeaveReportDetail = LeaveReportRow & DetailExtras;
export type AdvanceReportDetail = AdvanceReportRow & DetailExtras;

export type ApprovalReportParams = {
  user_id?: string;
  status?: RequestStatus;
  leave_policy_id?: string;
  advance_policy_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  per_page?: number;
  page?: number;
};

export type ReportPagination = {
  page?: number;
  next_page?: number | null;
  last_page?: number;
  result_count?: number;
};

export type ReportListResponse<T> = {
  code?: number;
  message?: string;
  payload: T[];
  pagination?: ReportPagination;
};

export type ReportDetailResponse<T> = {
  code?: number;
  message?: string;
  payload: T;
};

function createReportApi<Row, Detail>(resource: string) {
  return {
    getList: (params: ApprovalReportParams) =>
      baseApi.get<ReportListResponse<Row>>(`admin/${resource}/report`, {
        params,
      }),
    getById: (id: string) =>
      baseApi.get<ReportDetailResponse<Detail>>(
        `admin/${resource}/report/${encodeURIComponent(id)}`,
      ),
  };
}

export const LeaveRequestsReportApi = createReportApi<
  LeaveReportRow,
  LeaveReportDetail
>("leave-requests");

export const AdvanceRequestsReportApi = createReportApi<
  AdvanceReportRow,
  AdvanceReportDetail
>("advance-requests");
