import { apiClient } from "@/config/axios-config";

export type BriefInfoT = { about_me: string; id: string };

type ResponseT = {
  code: string;
  message: string;
  payload: BriefInfoT;
};

export default async function GetUserBrief(userId: string) {
  const res = await apiClient.get<ResponseT>(`/user_abouts/user${Boolean(userId) ? "/" + userId : ""}`);

  return res.data.payload;
}
