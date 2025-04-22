import { apiClient } from "@/config/axios-config";

export type PersonalUserDataSectionT = {
  name: string;
  nickname: string;
  gender: string;
  is_default: number;
  birthdate_gregorian: string;
  birthdate_hijri: string;
  nationality: string;
  country: string;
  country_id: number;
  nationalityRelation: string;
};

type ResponseT = {
  code: string;
  message: string;
  payload: PersonalUserDataSectionT;
};

export default async function GetPersonalUserData() {
  const res = await apiClient.get<ResponseT>(`company-users/show-data-info`);

  return res.data.payload;
}
