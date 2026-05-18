import {
  ConstraintEmployeesListApiResponse,
  ConstraintEmployeesListNormalized,
  ConstraintSelectedEmployeePayload,
} from "@/services/api/attendance-constraints/types/response";

function num(v: unknown, fallback: number): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function parseConstraintEmployeesList(
  body: ConstraintEmployeesListApiResponse,
): ConstraintEmployeesListNormalized {
  const raw = body.payload;

  let employees: ConstraintSelectedEmployeePayload[] = [];

  if (raw == null) {
    employees = [];
  } else if (Array.isArray(raw)) {
    employees = raw;
  } else if (typeof raw === "object") {
    employees = Object.values(
      raw as Record<string, ConstraintSelectedEmployeePayload>,
    );
  }

  const pm = body.pagination;
  let totalPages = pm != null ? num(pm.last_page, 1) : num(body.last_page, 1);
  let totalItems =
    pm != null
      ? num(pm.result_count, employees.length)
      : num(body.result_count, employees.length);

  if (!Number.isFinite(totalPages) || totalPages < 1) totalPages = 1;
  if (!Number.isFinite(totalItems) || totalItems < 0)
    totalItems = employees.length;

  return { employees, totalPages, totalItems };
}
