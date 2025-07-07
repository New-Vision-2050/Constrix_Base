import { apiClient } from "@/config/axios-config";
import { TeamMemberAttendance } from "../types/attendance";

/**
 * Fetches team attendance data including location information for map display
 * @returns Promise with team members' attendance data including geo-coordinates
 */
export const getTeamAttendance = async (): Promise<TeamMemberAttendance[]> => {
  const response = await apiClient.get("/attendance/team");
  return response.data.payload;
};
