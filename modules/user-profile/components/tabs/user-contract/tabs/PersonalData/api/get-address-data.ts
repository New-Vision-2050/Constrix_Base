import { apiClient } from "@/config/axios-config";

export type ResponseContactInfoDataT = {
  address: string;
  email: string;
  id: string;
  landline_number: string;
  other_phone: string;
  phone: string;
  phone_code: string;
  postal_code: string;
};

type ResponseT = {
  code: string;
  message: string;
  payload: ResponseContactInfoDataT;
};

export default async function GetUserContactInfoData(userId: string) {
  const res = await apiClient.get<ResponseT>(`/contactinfos/${userId}`);

  return res.data.payload;
}
