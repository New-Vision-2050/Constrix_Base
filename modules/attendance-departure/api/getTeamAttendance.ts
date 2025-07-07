import { apiClient } from "@/config/axios-config";
import { AttendanceStatusRecord } from "../types/attendance";

/**
 * Optional parameters for fetching team attendance
 */
export interface GetTeamAttendanceParams {
  start_date?: string;
  end_date?: string;
}

/**
 * Fetches team attendance data including location information for map display
 * @param params Optional parameters including start_date and end_date
 * @returns Promise with team members' attendance data including geo-coordinates
 */
export const getTeamAttendance = async (params?: GetTeamAttendanceParams): Promise<AttendanceStatusRecord[]> => {
  // Add query parameters if provided
  let url = "/attendance/team";
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
