import { apiClient } from "@/config/axios-config";
import { Relative } from "@/modules/user-profile/types/relative";

type ResponseT = {
  code: string;
  message: string;
  payload: Relative[];
};

export default async function GetUserRelativesData(userId: string) {
  const res = await apiClient.get<ResponseT>(`/user_relatives/user/${userId}`);

  return res.data.payload;
}
