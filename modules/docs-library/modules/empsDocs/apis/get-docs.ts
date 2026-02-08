import { apiClient } from "@/config/axios-config";
import { DocumentT } from "../../publicDocs/types/Directory";
import { SearchFormData } from "../../publicDocs/components/search-fields";

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
  page?: number,
  searchData?: SearchFormData,
  sort?: string,
) {
  // Build params object with only defined values
  const params: Record<string, string | number> = {
    type: "employee", // Added type parameter for employee docs
  };

  if (parentId) params.parent_id = parentId;
  if (branchId && branchId !== "all") params.branch_id = branchId;
  if (password?.length) params.password = password;
  if (limit) params.per_page = limit;
  if (page) params.page = page;

  // Add search filters only if they have valid values
  if (searchData?.type && searchData.type !== "all") {
    params.type = searchData.type;
  }
  if (searchData?.documentType && searchData.documentType !== "all") {
    params.document_type = searchData.documentType;
  }
  if (searchData?.endDate) {
    params.end_date = searchData.endDate;
  }

  if (searchData?.search?.length) {
    params.search = searchData.search;
  }
  if (sort) params.sort = sort;

  const res = await apiClient.get<ResponseT>(`/folders/contents`, {
    params,
  });

  return { payload: res.data.payload, pagination: res.data.pagination };
}
