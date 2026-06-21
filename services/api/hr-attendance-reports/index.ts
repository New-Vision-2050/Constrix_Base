import { baseApi } from "@/config/axios/instances/base";
import type { EmployeeAttendanceReportsParams } from "./types/params";
import type { EmployeeAttendanceReportsResponse } from "./types/response";

export const HrAttendanceReportsApi = {
  getReports: (params: EmployeeAttendanceReportsParams) =>
    baseApi.get<EmployeeAttendanceReportsResponse>("/hr/attendance/reports", {
      params,
    }),
};

export type {
  EmployeeAttendanceMonthlyReportApi,
  EmployeeAttendanceReportsPagination,
  EmployeeAttendanceReportsPayload,
  EmployeeAttendanceReportsResponse,
  EmployeeAttendanceReportStatus,
} from "./types/response";

export type { EmployeeAttendanceReportsParams } from "./types/params";
