import { baseApi } from "@/config/axios/instances/base";
import type {
  CreateReportFormPayload,
  UpdateReportFormPayload,
} from "./types/params";
import type {
  GetReportFormResponse,
  ListReportFormsResponse,
  MutateReportFormResponse,
} from "./types/response";

export const ReportFormsApi = {
  list: (projectTypeId: number | string) =>
    baseApi.get<ListReportFormsResponse>("order-permit-report-forms", {
      params: { project_type_id: projectTypeId },
    }),

  show: (reportFormId: number | string) =>
    baseApi.get<GetReportFormResponse>(
      `order-permit-report-forms/${reportFormId}`,
    ),

  create: (body: CreateReportFormPayload) =>
    baseApi.post<MutateReportFormResponse>("order-permit-report-forms", body),

  update: (reportFormId: number | string, body: UpdateReportFormPayload) =>
    baseApi.put<MutateReportFormResponse>(
      `order-permit-report-forms/${reportFormId}`,
      body,
    ),

  delete: (reportFormId: number | string) =>
    baseApi.delete<MutateReportFormResponse>(
      `order-permit-report-forms/${reportFormId}`,
    ),
};
