import { apiClient } from "@/config/axios-config";
import { DirectoryT } from "../types/Directory";

export type GetDocsResT = {
  folders: DirectoryT[];
  files: any[];
};
// API response type
type ResponseT = {
  code: string;
  message: string;
  payload: GetDocsResT;
};

export default async function getDocs() {
  const res = await apiClient.get<ResponseT>(`/folders/contents`);

  return res.data.payload;
}
