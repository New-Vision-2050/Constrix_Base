import axios from "axios";
import { apiClient, baseURL } from "@/config/axios-config";
import { AttendanceApiResponse, AttendanceFilterParams } from "./types";

/**
 * Fetches attendance data from the API with pagination, sorting, and filters
 */
export const fetchAttendanceData = async (
  page: number,
  limit: number,
  sortBy?: string,
  sortDirection?: "asc" | "desc",
  filters?: AttendanceFilterParams
): Promise<AttendanceApiResponse> => {
  const params: any = {
    page,
    per_page: limit,
  };

  // Add sorting parameters
  if (sortBy) {
    params.sort_by = sortBy;
    params.sort_direction = sortDirection || "asc";
  }

  // Add filter parameters
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params[key] = value;
      }
    });
  }

  const response = await apiClient.get(`${baseURL}/attendance/team`, { params });

  return {
    data: response.data.payload || [],
    totalPages: response.data.pagination?.last_page || 1,
    totalItems: response.data.pagination?.result_count || 0,
  };
};

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
