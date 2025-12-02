import { apiClient } from "@/config/axios-config";
import { ProfileWidgetData } from "../types/profile-widgets";

type ResponseT = {
  code: string;
  message: string;
  payload: ProfileWidgetData;
};

export default async function getProfileWidgetsData(userId: string) {
  const res = await apiClient.get<ResponseT>(
    `/company-users/widget/user${Boolean(userId) ? "/" + userId : ""}`
  );

  return res.data.payload;
}
