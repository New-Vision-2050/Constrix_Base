import { apiClient } from "@/config/axios-config";

/**
 * Fetches dropdown options for filters
 */
export const fetchDropdownOptions = async (
  url: string,
  searchParam?: string,
  searchValue?: string
): Promise<any[]> => {
  const params: any = { per_page: 10 };
  if (searchParam && searchValue) {
    params[searchParam] = searchValue;
  }

  const response = await apiClient.get(url, { params });
  return response.data.payload || [];
};
