import { useQuery } from "@tanstack/react-query";
import { HrAttendanceReportsApi } from "@/services/api/hr-attendance-reports";

export const EMPLOYEE_ATTENDANCE_REPORTS_QUERY_KEY =
  "employee-attendance-reports";

export interface EmployeeAttendanceReportsQueryOptions {
  page?: number;
  per_page?: number;
}

export function useEmployeeAttendanceReports(
  employeeId?: string,
  options: EmployeeAttendanceReportsQueryOptions = {},
) {
  const page = options.page ?? 1;
  const perPage = options.per_page ?? 12;

  return useQuery({
    queryKey: [
      EMPLOYEE_ATTENDANCE_REPORTS_QUERY_KEY,
      employeeId,
      page,
      perPage,
    ],
    queryFn: async () => {
      const response = await HrAttendanceReportsApi.getReports({
        employee_id: employeeId!,
        page,
        per_page: perPage,
      });
      return response.data.payload;
    },
    enabled: Boolean(employeeId),
  });
}
