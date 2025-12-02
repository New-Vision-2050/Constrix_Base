import { apiClient } from "@/config/axios-config";
import { Qualification } from "@/modules/user-profile/types/qualification";

type ResponseT = {
  code: string;
  message: string;
  payload: Qualification[];
};

export default async function GetQualificationsData(userId: string) {
  const res = await apiClient.get<ResponseT>(`/qualifications/user${Boolean(userId) ? "/" + userId : ""}`);

  return res.data.payload;
}
