import { apiClient } from "@/config/axios-config";

export type TimeUnit = { id: string; name: string };
type ResponseT = {
  code: string;
  message: string;
  payload: TimeUnit[];
};

export default async function GetTimeUnitsData() {
  const res = await apiClient.get<ResponseT>(`/time_units`);

  return res.data.payload;
}
