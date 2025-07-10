import { apiClient } from "@/config/axios-config";

/**
 * Interface for the attendance summary data
 */
export interface AttendanceSummaryData {
  total_days: number;
  total_attendant: number;
  total_absent_days: number;
  total_holiday_days: number;
  total_departures: number;
  total_work_hours: number;
  total_overtime_hours: number;
  total_break_hours: number;
  late_days: number;
  early_departures: number;
  average_work_hours: number;
  period: {
    start_date: string;
    end_date: string;
  };
}

/**
 * Optional parameters for fetching attendance summary
 */
interface GetAttendanceSummaryParams {
  start_date?: string;
  end_date?: string;
}

/**
 * Fetches attendance summary data for specified period
 * @param params Optional parameters including start_date and end_date
 * @returns Promise with attendance summary data
 */
export const getAttendanceSummary = async (params?: GetAttendanceSummaryParams): Promise<AttendanceSummaryData> => {
  // Add query parameters if provided
  let url = "/attendance/summary";
  if (params) {
    const queryParams = new URLSearchParams();
    if (params.start_date) queryParams.append("start_date", params.start_date);
    if (params.end_date) queryParams.append("end_date", params.end_date);
    
    const queryString = queryParams.toString();
    if (queryString) {
      url = `${url}?${queryString}`;
    }
  }

  const response = await apiClient.get(url);
  return response.data.payload;
};
