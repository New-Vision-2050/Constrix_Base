import { apiClient } from "@/config/axios-config";
import { DocumentT } from "../types/Directory";

export type GetDocsResT = {
  folders: DocumentT[];
  files: DocumentT[];
};
// API response type
type ResponseT = {
  code: string;
  message: string;
  payload: GetDocsResT;
};

export default async function getDocs(branchId?: string) {
  const res = await apiClient.get<ResponseT>(`/folders/contents`, {
    params: {
      branch_id: branchId == "all" ? undefined : branchId,
    },
  });

  return res.data.payload;
}
