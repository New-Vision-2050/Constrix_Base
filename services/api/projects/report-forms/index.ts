import { baseApi } from "@/config/axios/instances/base";
import type { CreateReportFormPayload, UpdateReportFormPayload } from "./types/params";
import type {
  GetReportFormResponse,
  ListReportFormsResponse,
  MutateReportFormResponse,
} from "./types/response";

export const ReportFormsApi = {
  list: (projectTypeId: number | string) =>
    baseApi.get<ListReportFormsResponse>("report-forms", {
      params: { project_type_id: projectTypeId },
    }),

  show: (reportFormId: number | string) =>
    baseApi.get<GetReportFormResponse>(`report-forms/${reportFormId}`),

  create: (body: CreateReportFormPayload) =>
    baseApi.post<MutateReportFormResponse>("report-forms", body),

  update: (reportFormId: number | string, body: UpdateReportFormPayload) =>
    baseApi.put<MutateReportFormResponse>(`report-forms/${reportFormId}`, body),

  delete: (reportFormId: number | string) =>
    baseApi.delete<MutateReportFormResponse>(`report-forms/${reportFormId}`),
};
