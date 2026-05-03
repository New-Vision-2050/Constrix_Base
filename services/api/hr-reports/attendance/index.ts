import { baseApi } from "@/config/axios/instances/base";
import type { CreateReportApiBody } from "./types/request";
import { downloadFromResponse } from "@/utils/downloadFromResponse";
import type {
  ListReportsParams,
  ListReportTemplatesParams,
} from "./types/params";
import type {
  AttendanceReportDetailRaw,
  AttendanceReportMutationRaw,
  AttendanceReportsListRaw,
} from "./types/response";

export const AttendanceReportsApi = {
  getList: (params: ListReportsParams) =>
    baseApi.get<AttendanceReportsListRaw>("reports", { params }),

  getById: (reportId: string) =>
    baseApi.get<AttendanceReportDetailRaw>(`reports/${reportId}`),

  create: (body: CreateReportApiBody) =>
    baseApi.post<AttendanceReportMutationRaw>("reports", body),

  saveTemplate: (body: CreateReportApiBody) =>
    baseApi.post<AttendanceReportMutationRaw>("reports/templates", body),

  getTemplatesList: (params: ListReportTemplatesParams) =>
    baseApi.get<AttendanceReportsListRaw>("reports/templates", { params }),

  download: async (reportId: string) => {
    const response = await baseApi.get(`reports/${reportId}/download`, {
      responseType: "blob",
    });
    downloadFromResponse(response);
  },
};

export type {
  ListReportsParams,
  ListReportTemplatesParams,
} from "./types/params";

export type {
  AttendanceReportDetailRaw,
  AttendanceReportMutationRaw,
  AttendanceReportsListRaw,
} from "./types/response";

export type { CreateReportApiBody } from "./types/request";

export type {
  CreatedAttendanceReport,
  ReportTemplatePickRow,
} from "./types/response";
