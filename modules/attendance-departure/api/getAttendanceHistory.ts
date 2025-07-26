import { apiClient } from "@/config/axios-config";
import { AttendanceHistoryRoot, AttendanceStatusRecord } from "../types/attendance";

export interface AttendanceHistoryParams {
  start_date: string;
  end_date: string;
  user_id: string;
}

export const getAttendanceHistory = async (
id: string,
startDate: string,
endDate: string
): Promise<AttendanceHistoryRoot> => {
  const searchParams = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
    user_id: id,
  });

  const response = await apiClient.get(`/attendance/history?${searchParams}`);
  return response.data;
};
