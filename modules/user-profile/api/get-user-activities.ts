import { apiClient } from "@/config/axios-config";
import { UserActivityT } from "../types/user-activity";

type ResponseT = {
  code: string;
  message: string;
  payload: UserActivityT[];
};

export default async function getUserActivities(
  userId?: string,
  limit?: number
) {
  const url = Boolean(userId) ? `/audits?user_id=${userId}` : `/audits`;
  const res = await apiClient.get<ResponseT>(url, {
    params: { per_page: limit ?? 6 },
  });

  return res.data.payload;
}
