import { apiClient } from "@/config/axios-config";
import { AttendanceHistoryRoot, AttendanceStatusRecord } from "../types/attendance";

export interface AttendanceHistoryParams {
  start_date: string;
  end_date: string;
  user_id: string;
}

export const getAttendanceHistory = async (
  record: AttendanceStatusRecord
): Promise<AttendanceHistoryRoot> => {
  const searchParams = new URLSearchParams({
    start_date: record.work_date,
    end_date: record.work_date,
    user_id: record.user.id,
  });

  const response = await apiClient.get(`/attendance/history?${searchParams}`);
  return response.data;
};
