import { apiClient } from "@/config/axios-config";

export type InfoAlertItem = {
  type: string;
  title: string;
  end_date: string | null;
  user_id: string;
  name: string;
  days_remaining: number | null;
};

type ResponseT = {
  code: string;
  message: string | null;
  payload: InfoAlertItem[];
};

export default async function fetchUserInfoAlert(userId?: string) {
  const res = await apiClient.get<ResponseT>(`/users/info-alert`, {
    params: userId ? { user_id: userId } : undefined,
  });
  console.log("res", res);
  return res.data.payload;
}
