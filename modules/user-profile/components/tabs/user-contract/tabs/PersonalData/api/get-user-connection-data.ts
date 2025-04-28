import { apiClient } from "@/config/axios-config";

export type UserConnectionInformationT = {
  email: string;
  phone: string;
};

type ResponseT = {
  code: string;
  message: string;
  payload: UserConnectionInformationT;
};

export default async function GetUserConnectionData(userId?: string) {
  const res = await apiClient.get<ResponseT>(`company-users/show-contact-information${userId ? "/" + userId : ""}`);

  return res.data.payload;
}
