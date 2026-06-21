import { useQuery } from "@tanstack/react-query";
import { HrAttendanceReportsApi } from "@/services/api/hr-attendance-reports";

export const EMPLOYEE_ATTENDANCE_REPORTS_QUERY_KEY =
  "employee-attendance-reports";

export function useEmployeeAttendanceReports(employeeId?: string) {
  return useQuery({
    queryKey: [EMPLOYEE_ATTENDANCE_REPORTS_QUERY_KEY, employeeId],
    queryFn: async () => {
      const response = await HrAttendanceReportsApi.getReports({
        employee_id: employeeId!,
      });
      return response.data.payload;
    },
    enabled: Boolean(employeeId),
  });
}
