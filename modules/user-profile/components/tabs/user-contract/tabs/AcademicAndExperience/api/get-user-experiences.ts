import { apiClient } from "@/config/axios-config";

type ResponseT = {
  code: string;
  message: string;
  payload: {};
};

export default async function GetUserExperienceData(userId: string) {
  const res = await apiClient.get<ResponseT>(
    `/user_experiences/user/${userId}`
  );

  return res.data.payload;
}
