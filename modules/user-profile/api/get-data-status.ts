import { apiClient } from "@/config/axios-config";
import { ProfileDataStatus } from "../types/profile-data-status";

type ResponseT = {
  code: string;
  message: string;
  payload: ProfileDataStatus;
};

export default async function getProfileDataStatus(userId: string) {
  const res = await apiClient.get<ResponseT>(
    `/company-users/data-status/user${Boolean(userId) ? "/" + userId : ""}`
  );

  return res.data.payload;
}
