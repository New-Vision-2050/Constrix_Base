import { apiClient } from "@/config/axios-config";
import { AttendanceHistory } from "../components/map/types";

// API response type
type ResponseT = {
  code: string;
  message: string;
  payload: AttendanceHistory[];
};

export default async function getMapEmpAttendanceHistory(user_id: string) {
  const todayDate = new Date();
  
  // Format date as yyyy-mm-dd
  const year = todayDate.getFullYear();
  const month = String(todayDate.getMonth() + 1).padStart(2, '0');
  const day = String(todayDate.getDate()).padStart(2, '0');
  const todayDateString = `${year}-${month}-${day}`;
  const url = `/attendance/history?user_id=${user_id}&&start_date=${todayDateString}&end_date=${todayDateString}`;
  const res = await apiClient.get<ResponseT>(url);

  return res.data.payload;
}
