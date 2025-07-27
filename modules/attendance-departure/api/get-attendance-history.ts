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
  const todayDateString = todayDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const url = `/attendance/history?user_id=${user_id}&&dateFrom=${todayDateString}&dateTo=${todayDateString}`;
  const res = await apiClient.get<ResponseT>(url);

  return res.data.payload;
}
