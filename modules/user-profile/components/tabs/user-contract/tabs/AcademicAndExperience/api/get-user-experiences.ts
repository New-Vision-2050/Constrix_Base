import { apiClient } from "@/config/axios-config";
import { Experience } from "@/modules/user-profile/types/experience";

type ResponseT = {
  code: string;
  message: string;
  payload: Experience[];
};

export default async function GetUserExperienceData(userId: string) {
  const res = await apiClient.get<ResponseT>(
    `/user_experiences/user/${userId}`
  );

  return res.data.payload;
}
