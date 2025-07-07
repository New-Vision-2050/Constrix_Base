import { apiClient } from "@/config/axios-config";
import { AttendanceStatusRecord } from "../types/attendance";

/**
 * Fetches team attendance data including location information for map display
 * @returns Promise with team members' attendance data including geo-coordinates
 */
export const getTeamAttendance = async (): Promise<AttendanceStatusRecord[]> => {
  const response = await apiClient.get("/attendance/team");
  return response.data.payload;
};
