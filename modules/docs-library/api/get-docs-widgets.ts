import { apiClient } from "@/config/axios-config";
import { Media } from "@/modules/docs-library/modules/publicDocs/types/Directory";

export type DocsWidgetsT = {
  total_files_count: number;
  all_file_space: number;
  all_remain_file_space: number;
  all_consumed_file_space: number;
  expired_files_count: number;
  expired_files_percentage: number;
  valid_files_count: number;
  valid_files_percentage: number;
  almost_expired_files_count: number;
  almost_expired_files_percentage: number;
  almost_expired_files: Media[];
};

// API response type
type ResponseT = {
  code: string;
  message: string;
  data: DocsWidgetsT;
};

export default async function getDocsWidgets(parentId?: string) {
  let params = {};
  if (parentId?.length) {
    params = { parent_id: parentId };
  }
  const res = await apiClient.get<ResponseT>(`/files/widgets`, { params: params });

  return res.data.data;
}
