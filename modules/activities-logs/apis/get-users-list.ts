import { apiClient } from "@/config/axios-config";
import { SearchUserActivityLogT } from "../context/ActivitiesLogsCxt";

// API response type
type ResponseT = {
  code: string;
  message: string;
  payload: { id: string; name: string }[];
};

export default async function getUsersList() {
  const res = await apiClient.get<ResponseT>(`/users`);

  return res.data.payload;
}
