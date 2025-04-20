import { UserProfileData } from "../types/user-profile-response";
import { apiClient } from "@/config/axios-config";

type ResponseT = {
  code: string;
  message: string;
  payload: UserProfileData;
};

export default async function fetchUserProfileData() {
  const res = await apiClient.get<ResponseT>(`/company-users/profile`);

  return res.data.payload;
}
