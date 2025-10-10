import { apiClient } from "@/config/axios-config";

// API request type
export type CopyMoveFileRequest = {
  folder_id: string;
  file_id: string;
};

// API response type
type ResponseT = {
  code: string;
  message: string;
  payload?: any;
};

export async function copyFile(data: CopyMoveFileRequest) {
  const res = await apiClient.post<ResponseT>(`/files/copy`, data);
  return res.data;
}

export async function moveFile(data: CopyMoveFileRequest) {
  const res = await apiClient.post<ResponseT>(`/files/cut`, data);
  return res.data;
}
