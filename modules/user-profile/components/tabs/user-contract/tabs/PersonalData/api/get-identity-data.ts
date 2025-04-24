import { apiClient } from "@/config/axios-config";
import { MediaFile } from "@/types/media-file";

export type UserIdentityInformationT = {
  border_number: string;
  entry_number: string;
  file_border_number: MediaFile[];
  file_entry_number: MediaFile[];
  file_identity: MediaFile[];
  file_passport: MediaFile[];
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
  file_work_permit: MediaFile[];
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
