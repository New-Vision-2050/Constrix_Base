import { apiClient } from "@/config/axios-config";
import { UserProfileData } from "../types/user-profile-response";

type ResponseT = {
  code: string;
  message: string;
  payload: UserProfileData;
};

export default async function fetchUserProfileData(userId?: string) {
  const url = Boolean(userId)
    ? `/company-users/profile/${userId}`
    : `/company-users/profile`;
  const res = await apiClient.get<ResponseT>(url);

  return res.data.payload;
}
