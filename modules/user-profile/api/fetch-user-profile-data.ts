import { apiClient } from "@/config/axios-config";
import { UserProfileData } from "@/modules/dashboard/types/user-profile-response";

type ResponseT = {
  code: string;
  message: string;
  payload: UserProfileData;
};

export default async function fetchUserProfileData() {
  const res = await apiClient.get<ResponseT>(`/company-users/profile`);

  return res.data.payload;
}
