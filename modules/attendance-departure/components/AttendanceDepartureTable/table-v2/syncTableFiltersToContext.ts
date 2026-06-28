import type { AttendanceFilterParams } from "./types";

type ContextFilterSetters = {
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  setSearchText: (text: string) => void;
  setSelectedBranch: (branch: string) => void;
  setSelectedDepartment: (department: string) => void;
  setSelectedApprover: (approver: string) => void;
  setSelectedAttendanceStatus: (status: string) => void;
};

/** Parse YYYY-MM-DD without UTC timezone shift. */
export function parseFilterDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toTrimmedString(value: unknown): string | undefined {
  if (value == null || value === "") return undefined;
  const trimmed = String(value).trim();
  return trimmed || undefined;
}

/** Trim filters and ensure both dates are sent when either is set. */
export function normalizeAttendanceFilters(
  filters: AttendanceFilterParams,
): AttendanceFilterParams {
  const normalized: AttendanceFilterParams = {};

  const searchText = toTrimmedString(filters.search_text);
  if (searchText) normalized.search_text = searchText;

  const branchId = toTrimmedString(filters.branch_id);
  if (branchId) normalized.branch_id = branchId;

  const managementId = toTrimmedString(filters.management_id);
  if (managementId) normalized.management_id = managementId;

  const constraintId = toTrimmedString(filters.constraint_id);
  if (constraintId) normalized.constraint_id = constraintId;

  const attendanceStatus = toTrimmedString(filters.attendance_status);
  if (attendanceStatus) normalized.attendance_status = attendanceStatus;

  const start = toTrimmedString(filters.start_date);
  const end = toTrimmedString(filters.end_date);

  if (start || end) {
    normalized.start_date = start || end;
    normalized.end_date = end || start;
  }

  return normalized;
}

export function syncTableFiltersToContext(
  filters: AttendanceFilterParams,
  ctx: ContextFilterSetters,
) {
  const normalized = normalizeAttendanceFilters(filters);

  ctx.setStartDate(
    normalized.start_date ? parseFilterDate(normalized.start_date) : null,
  );
  ctx.setEndDate(
    normalized.end_date ? parseFilterDate(normalized.end_date) : null,
  );
  ctx.setSearchText(normalized.search_text ?? "");
  ctx.setSelectedBranch(normalized.branch_id ?? "all");
  ctx.setSelectedDepartment(normalized.management_id ?? "all");
  ctx.setSelectedApprover(normalized.constraint_id ?? "all");
  ctx.setSelectedAttendanceStatus(normalized.attendance_status ?? "all");
}

/** Initial load: no date filters — dates are sent only after the user searches. */
export function defaultAttendanceFilters(): AttendanceFilterParams {
  return {};
}

export function attendanceFiltersQueryKey(
  filters: AttendanceFilterParams,
): (string | number | undefined)[] {
  const normalized = normalizeAttendanceFilters(filters);
  return [
    normalized.search_text ?? "",
    normalized.branch_id ?? "",
    normalized.management_id ?? "",
    normalized.constraint_id ?? "",
    normalized.attendance_status ?? "",
    normalized.start_date ?? "",
    normalized.end_date ?? "",
  ];
}
