import { apiClient } from "@/config/axios-config";
import { Media } from "@/modules/docs-library/modules/publicDocs/types/Directory";

export type DocsWidgetsT = {
  total_files_count: number;
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

export default async function getDocsWidgets() {
  const res = await apiClient.get<ResponseT>(`/files/widgets`);

  return res.data.data;
}
