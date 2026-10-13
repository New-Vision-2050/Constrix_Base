/**
 * Unified approver-inbox shapes shared by leave & advance requests.
 * Rows mirror the `admin/employee-tasks/inbox` item structure.
 */

export interface ApprovalInboxEmployee {
  id: string;
  name: string;
}

export interface ApprovalInboxActionTaker {
  user_id: string;
  name: string;
}

export interface ApprovalInboxCurrentStep {
  id: number;
  name: string | null;
  step_order: number | null;
  is_approve: boolean;
  action_takers: ApprovalInboxActionTaker[];
}

export interface LeaveRequestSummary {
  leave_policy?: string | null;
  leave_type?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  total_days?: number | null;
  is_emergency?: boolean;
  reason?: string | null;
}

export interface AdvanceRequestSummary {
  advance_policy?: string | null;
  amount?: number | null;
  installments?: number | null;
  reason?: string | null;
}

export interface ApprovalInboxRow<
  TSummary = LeaveRequestSummary | AdvanceRequestSummary,
> {
  id: string;
  type?: string;
  type_label?: string;
  category?: string;
  category_label?: string;
  task?: unknown;
  employee?: ApprovalInboxEmployee | null;
  status?: string;
  current_step?: ApprovalInboxCurrentStep | null;
  duration_hours?: string | null;
  summary?: TSummary | null;
  created_at?: string;
}

export type LeaveRequestInboxRow = ApprovalInboxRow<LeaveRequestSummary>;
export type AdvanceRequestInboxRow = ApprovalInboxRow<AdvanceRequestSummary>;

/** Note: this family of endpoints uses `total` (not `result_count`). */
export interface ApprovalInboxPagination {
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}

export interface ApprovalInboxListResponse<TSummary> {
  code?: string;
  message?: string;
  payload:
    | ApprovalInboxRow<TSummary>[]
    | Record<string, ApprovalInboxRow<TSummary>>
    | null;
  pagination?: ApprovalInboxPagination;
}

export interface ApprovalInboxActionResponse<TSummary> {
  code?: string;
  message?: string;
  payload?: ApprovalInboxRow<TSummary> | null;
}

export interface LeaveInboxCountsPayload {
  pending_leave_requests?: number;
  total?: number;
}

export interface AdvanceInboxCountsPayload {
  pending_advance_requests?: number;
  total?: number;
}

export interface ApprovalInboxCountsResponse<TPayload> {
  code?: string;
  message?: string;
  payload?: TPayload | null;
}
