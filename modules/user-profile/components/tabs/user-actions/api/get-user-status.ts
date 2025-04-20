import { apiClient } from "@/config/axios-config";

export type UserStatusT = {
  active_date_to: string;
  active_type: string;
  id: string;
};

type ResponseT = {
  code: string;
  message: string;
  payload: UserStatusT;
};

export default async function GetUserStatusData(userId: string) {
  const res = await apiClient.get<ResponseT>(`/user_statuses/user/${userId}`);

  return res.data.payload;
}
