import { baseApi } from "@/config/axios/instances/base";
import type { CreateReportApiBody } from "./types/request";
import type {
  ListReportsParams,
  ListReportTemplatesParams,
} from "./types/params";
import type {
  AttendanceReportDetailRaw,
  AttendanceReportMutationRaw,
  attendanceReportListResponse,
  AttendanceReportsListRaw,
  ReportDownloadRaw,
} from "./types/response";

export const AttendanceReportsApi = {
  getList: (params: ListReportsParams) =>
    baseApi.get<attendanceReportListResponse>("reports", { params }),

  getById: (reportId: string) =>
    baseApi.get<AttendanceReportDetailRaw>(`reports/${reportId}`),

  create: (body: CreateReportApiBody) =>
    baseApi.post<AttendanceReportMutationRaw>("reports", body),

  saveTemplate: (body: CreateReportApiBody) =>
    baseApi.post<AttendanceReportMutationRaw>("reports/templates", body),

  getTemplatesList: (params: ListReportTemplatesParams) =>
    baseApi.get<AttendanceReportsListRaw>("reports/templates", { params }),

  download: async (reportId: string) => {
    const { data } = await baseApi.get<ReportDownloadRaw>(
      `reports/${reportId}/download`,
      { headers: { Accept: "application/json" } },
    );
    const url = data?.payload?.download_url;
    if (!url) {
      throw new Error("download_url missing from report download response");
    }
    window.open(url, "_blank", "noopener,noreferrer");
    return data.payload;
  },
  delete: (reportId: string) =>
    baseApi.delete(`reports/${reportId}`),
};

export type {
  ListReportsParams,
  ListReportTemplatesParams,
} from "./types/params";

export type {
  AttendanceReportDetailRaw,
  AttendanceReportMutationRaw,
  AttendanceReportsListRaw,
  ReportDownloadRaw,
  attendanceReport,
  attendanceReportListResponse,
} from "./types/response";

export type { CreateReportApiBody } from "./types/request";

export type {
  CreatedAttendanceReport,
  ReportTemplatePickRow,
} from "./types/response";
