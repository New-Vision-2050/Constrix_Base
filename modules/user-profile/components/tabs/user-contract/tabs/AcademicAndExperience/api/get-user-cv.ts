import { apiClient } from "@/config/axios-config";
import { MediaFile } from "@/types/media-file";

export type UserCVFilesT = {
  id: string;
  files:MediaFile;
};

type ResponseT = {
  code: string;
  message: string;
  payload: UserCVFilesT;
};

export default async function GetUserCV(userId: string) {
  const res = await apiClient.get<ResponseT>(`/biographies/user${Boolean(userId) ? "/" + userId : ""}`);

  return res.data.payload;
}
