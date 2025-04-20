import { apiClient } from "@/config/axios-config";

export type UserCVFilesT = {
  id: string;
  files: string;
};

type ResponseT = {
  code: string;
  message: string;
  payload: UserCVFilesT;
};

export default async function GetUserCV(userId: string) {
  const res = await apiClient.get<ResponseT>(`/biographies/user/${userId}`);

  return res.data.payload;
}
