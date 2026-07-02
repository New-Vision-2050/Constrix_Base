import { baseApi } from "@/config/axios/instances/base";
import type {
  EmployeeTaskInboxListResponse,
  EmployeeTaskProceduresResponse,
} from "./types/response";

export type {
  EmployeeTaskInboxRow,
  EmployeeTaskInboxListResponse,
  EmployeeTaskCurrentStep,
  EmployeeTaskUser,
  EmployeeTaskProcedure,
  EmployeeTaskProcedureStep,
  EmployeeTaskProcedureAttachment,
  EmployeeTaskProceduresSummary,
  EmployeeTaskProceduresPayload,
  EmployeeTaskProceduresResponse,
} from "./types/response";

export interface EmployeeTaskInboxParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export const EmployeeTasksApi = {
  inbox: (params?: EmployeeTaskInboxParams) =>
    baseApi.get<EmployeeTaskInboxListResponse>("admin/employee-tasks/inbox", {
      params,
    }),

  approve: (taskId: string) =>
    baseApi.patch(
      `admin/employee-tasks/${encodeURIComponent(taskId)}/approve`,
    ),

  reject: (taskId: string, body: { rejection_reason: string }) =>
    baseApi.patch(
      `admin/employee-tasks/${encodeURIComponent(taskId)}/reject`,
      body,
    ),

  procedures: (taskId: string) =>
    baseApi.get<EmployeeTaskProceduresResponse>(
      `employee-tasks/${encodeURIComponent(taskId)}/procedures`,
    ),
};
