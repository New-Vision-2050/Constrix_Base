import { apiClient } from "@/config/axios-config";
import {
  PaginatedLeaveRequests,
  UserLeaveRequest,
} from "../types";

type RawLeaveRequest = Record<string, unknown>;

type ResponseT = {
  status?: boolean;
  message?: string;
  payload?: RawLeaveRequest[] | { data?: RawLeaveRequest[] };
  data?: RawLeaveRequest[] | { data?: RawLeaveRequest[] };
  pagination?: { last_page?: number; total?: number };
  meta?: { last_page?: number; total?: number };
};

export type GetUserLeaveRequestsArgs = {
  userId: string;
  status?: string;
  year?: number;
  page?: number;
  perPage?: number;
};

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }
  return undefined;
}

function firstNumber(...values: unknown[]): number | undefined {
  for (const value of values) {
    const num = Number(value);
    if (value !== null && value !== undefined && value !== "" && Number.isFinite(num)) {
      return num;
    }
  }
  return undefined;
}

function nestedName(value: unknown): string | undefined {
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return firstString(record.name, record.title, record.label);
  }
  return undefined;
}

/** Tolerant mapper — the leave-request object shape lives in LEAVE_REQUEST_API_SPEC. */
function normalizeLeaveRequest(raw: RawLeaveRequest): UserLeaveRequest {
  return {
    id: firstString(raw.id, raw.leave_request_id) ?? "",
    leave_type_id: firstString(raw.leave_type_id),
    leave_type_name:
      firstString(raw.leave_type_name) ?? nestedName(raw.leave_type),
    leave_policy_id: firstString(raw.leave_policy_id),
    leave_policy_name:
      firstString(raw.leave_policy_name) ?? nestedName(raw.leave_policy),
    start_date: firstString(raw.start_date, raw.from_date, raw.from, raw.date),
    end_date: firstString(raw.end_date, raw.to_date, raw.to),
    days_count: firstNumber(
      raw.days_count,
      raw.days,
      raw.total_days,
      raw.duration,
    ),
    status: firstString(raw.status) ?? "pending",
    status_label_ar: firstString(raw.status_label_ar),
    rejection_reason: firstString(raw.rejection_reason) ?? null,
    created_at: firstString(raw.created_at),
    workflow:
      raw.workflow && typeof raw.workflow === "object"
        ? (raw.workflow as UserLeaveRequest["workflow"])
        : null,
    pending_step_order: firstNumber(raw.pending_step_order),
  };
}

function extractRows(payload: ResponseT["payload"]): RawLeaveRequest[] {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

/**
 * GET /leave-requests?user_id=&status=&year=&page=&per_page=
 * Admin list of leave requests filtered to a single user.
 */
export default async function getUserLeaveRequests({
  userId,
  status,
  year,
  page = 1,
  perPage = 10,
}: GetUserLeaveRequestsArgs): Promise<PaginatedLeaveRequests> {
  const res = await apiClient.get<ResponseT>("/leave-requests", {
    params: {
      user_id: userId,
      ...(status ? { status } : {}),
      ...(year ? { year } : {}),
      page,
      per_page: perPage,
    },
  });

  const rows = extractRows(res.data?.payload ?? res.data?.data);
  const meta = res.data?.pagination ?? res.data?.meta;

  return {
    rows: rows.map(normalizeLeaveRequest),
    lastPage: meta?.last_page ?? 1,
    total: meta?.total,
  };
}
