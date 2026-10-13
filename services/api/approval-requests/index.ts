import { baseApi } from "@/config/axios/instances/base";
import type {
  AdvanceInboxCountsPayload,
  AdvanceRequestSummary,
  ApprovalInboxActionResponse,
  ApprovalInboxCountsResponse,
  ApprovalInboxListResponse,
  LeaveInboxCountsPayload,
  LeaveRequestSummary,
} from "./types/response";

export type {
  AdvanceInboxCountsPayload,
  AdvanceRequestInboxRow,
  AdvanceRequestSummary,
  ApprovalInboxActionResponse,
  ApprovalInboxActionTaker,
  ApprovalInboxCountsResponse,
  ApprovalInboxCurrentStep,
  ApprovalInboxEmployee,
  ApprovalInboxListResponse,
  ApprovalInboxPagination,
  ApprovalInboxRow,
  LeaveInboxCountsPayload,
  LeaveRequestInboxRow,
  LeaveRequestSummary,
} from "./types/response";

export interface ApprovalInboxParams {
  page?: number;
  per_page?: number;
  /** `Y-m-d`, applied to the request creation date. */
  date_from?: string;
  /** `Y-m-d`, applied to the request creation date. */
  date_to?: string;
}

export interface ApprovalInboxCountsParams {
  date_from?: string;
  date_to?: string;
}

export const LeaveRequestsApi = {
  inbox: (params?: ApprovalInboxParams) =>
    baseApi.get<ApprovalInboxListResponse<LeaveRequestSummary>>(
      "admin/leave-requests/inbox",
      { params },
    ),

  inboxCounts: (params?: ApprovalInboxCountsParams) =>
    baseApi.get<ApprovalInboxCountsResponse<LeaveInboxCountsPayload>>(
      "admin/leave-requests/inbox-counts",
      { params },
    ),

  approve: (id: string) =>
    baseApi.patch<ApprovalInboxActionResponse<LeaveRequestSummary>>(
      `admin/leave-requests/${encodeURIComponent(id)}/approve`,
    ),

  reject: (id: string, body: { rejection_reason: string }) =>
    baseApi.patch<ApprovalInboxActionResponse<LeaveRequestSummary>>(
      `admin/leave-requests/${encodeURIComponent(id)}/reject`,
      body,
    ),
};

export const AdvanceRequestsApi = {
  inbox: (params?: ApprovalInboxParams) =>
    baseApi.get<ApprovalInboxListResponse<AdvanceRequestSummary>>(
      "admin/advance-requests/inbox",
      { params },
    ),

  inboxCounts: (params?: ApprovalInboxCountsParams) =>
    baseApi.get<ApprovalInboxCountsResponse<AdvanceInboxCountsPayload>>(
      "admin/advance-requests/inbox-counts",
      { params },
    ),

  approve: (id: string) =>
    baseApi.patch<ApprovalInboxActionResponse<AdvanceRequestSummary>>(
      `admin/advance-requests/${encodeURIComponent(id)}/approve`,
    ),

  reject: (id: string, body: { rejection_reason: string }) =>
    baseApi.patch<ApprovalInboxActionResponse<AdvanceRequestSummary>>(
      `admin/advance-requests/${encodeURIComponent(id)}/reject`,
      body,
    ),
};
