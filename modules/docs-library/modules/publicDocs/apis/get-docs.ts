import { apiClient } from "@/config/axios-config";
import { DocumentT } from "../types/Directory";

export type GetDocsResT = {
  folders: DocumentT[];
  files: DocumentT[];
};

export type DocsResPaginatedT = {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
};

// API response type
type ResponseT = {
  code: string;
  message: string;
  pagination: DocsResPaginatedT;
  payload: GetDocsResT;
};

export default async function getDocs(
  branchId?: string,
  parentId?: string,
  password?: string,
  limit?: number,
  page?: number
) {
  const res = await apiClient.get<ResponseT>(`/folders/contents`, {
    params: {
      // folder parent id
      parent_id: parentId,
      branch_id: branchId == "all" ? undefined : branchId,
      password: password?.length ? password : undefined,
      per_page: limit,
      page,
    },
  });

  return { payload: res.data.payload, pagination: res.data.pagination };
}
