import { AttendanceStatusRecord } from "@/modules/attendance-departure/types/attendance";

/**
 * API response structure for attendance data
 */
export interface AttendanceApiResponse {
  data: AttendanceStatusRecord[];
  totalPages: number;
  totalItems: number;
}

/**
 * Filter parameters for attendance search
 */
export interface AttendanceFilterParams {
  search_text?: string;
  branch_id?: string;
  management_id?: string;
  constraint_id?: string;
  start_date?: string;
  end_date?: string;
}

/**
 * Dropdown option structure for filters
 */
export interface DropdownOption {
  id: string;
  name: string;
}

/**
 * Props for the filters component
 */
export interface AttendanceFiltersProps {
  filters: AttendanceFilterParams;
  onFilterChange: (filters: AttendanceFilterParams) => void;
  onReset: () => void;
}
