import { apiClient } from "@/config/axios-config";
import getHierarchies from "@/modules/attendance-departure/api/getHierarchies";
import { getAllConstraintsForSelect } from "@/modules/attendance-departure/api/getConstraints";
import {
  AttendanceApiResponse,
  AttendanceFilterParams,
  DropdownOption,
} from "./types";
import { normalizeAttendanceFilters } from "./syncTableFiltersToContext";

/**
 * Maps UI filters to `/attendance/team` query params.
 * Matches legacy TableBuilder column search keys (`search_text`, `sort`, `order`).
 */
function mapFiltersToQueryParams(
  filters?: AttendanceFilterParams,
): Record<string, string> {
  if (!filters) return {};

  const normalized = normalizeAttendanceFilters(filters);
  const params: Record<string, string> = {};

  if (normalized.search_text) {
    params.search_text = normalized.search_text;
  }
  if (normalized.branch_id) {
    params.branch_id = normalized.branch_id;
  }
  if (normalized.management_id) {
    params.management_id = normalized.management_id;
  }
  if (normalized.constraint_id) {
    params.constraint_id = normalized.constraint_id;
  }
  if (normalized.attendance_status) {
    params.attendance_status = normalized.attendance_status;
  }
  if (normalized.start_date) {
    params.start_date = normalized.start_date;
  }
  if (normalized.end_date) {
    params.end_date = normalized.end_date;
  }

  return params;
}

/**
 * Fetches attendance data from the API with pagination, sorting, and filters
 */
export const fetchAttendanceData = async (
  page: number,
  limit: number,
  sortBy?: string,
  sortDirection?: "asc" | "desc",
  filters?: AttendanceFilterParams,
): Promise<AttendanceApiResponse> => {
  const params: Record<string, string | number> = {
    page,
    per_page: limit,
  };

  if (sortBy) {
    params.sort = sortBy;
    params.order = sortDirection || "asc";
  }

  Object.assign(params, mapFiltersToQueryParams(filters));

  const response = await apiClient.get("/attendance/team", { params });

  return {
    data: response.data.payload || [],
    totalPages: response.data.pagination?.last_page || 1,
    totalItems: response.data.pagination?.result_count || 0,
  };
};

export async function fetchBranchOptions(): Promise<DropdownOption[]> {
  const payload = await getHierarchies("branch");
  return payload.map((item) => ({ id: String(item.id), name: item.name }));
}

export async function fetchManagementOptions(): Promise<DropdownOption[]> {
  const payload = await getHierarchies("management");
  return payload.map((item) => ({ id: String(item.id), name: item.name }));
}

export async function fetchConstraintOptions(): Promise<DropdownOption[]> {
  const payload = await getAllConstraintsForSelect();

  return payload.map((item) => ({
    id: String(item.id),
    name: item.constraint_name,
  }));
}
