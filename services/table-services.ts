import { apiClient } from "@/config/axios-config";
export const getTableData = async (
  endPoint: string,
  params?: Record<string, string | number>
) => {
  return await apiClient.get(endPoint, { params });
};
