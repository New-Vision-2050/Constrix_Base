import { apiClient } from "@/config/axios-config";

export type ResponseSocialDataT = {
  id: string;
  linkedin: string;
  snapchat: string;
  telegram: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
};

type ResponseT = {
  code: string;
  message: string;
  payload: ResponseSocialDataT;
};

export default async function GetUserSocialData(userId: string) {
  const res = await apiClient.get<ResponseT>(`/socials${Boolean(userId) ? "/" + userId : ""}`);

  return res.data.payload;
}
