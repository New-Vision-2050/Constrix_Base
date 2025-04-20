import { apiClient } from "@/config/axios-config";

type fileType = {
  id: number;
  url: string;
};
export type UserIdentityInformationT = {
  border_number: string;
  entry_number: string;
  file_border_number: fileType;
  file_entry_number: fileType;
  file_identity: fileType;
  file_passport: fileType;
  identity: string;
  passport: string;
  passport_start_date: string;
  identity_start_date: string;
  border_number_start_date: string;
  entry_number_start_date: string;
  passport_end_date: string;
  identity_end_date: string;
  border_number_end_date: string;
  entry_number_end_date: string;
  work_permit: string;
  work_permit_start_date: string;
  work_permit_end_date: string;
  file_work_permit: fileType;
};

type ResponseT = {
  code: string;
  message: string;
  payload: UserIdentityInformationT;
};

export default async function GetUserIdentityData() {
  const res = await apiClient.get<ResponseT>(
    `/company-users/show-identity-data`
  );
  return res.data.payload;
}
