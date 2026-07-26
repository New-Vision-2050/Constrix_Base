export interface ProjectSafetyReportDto {
  morphable_type?: string | null;
  morphable_id?: string | null;
  morphable_display?: string | null;
  contractor_id?: string | null;
  contractor_name?: string | null;
  consultant_engineer?: string | null;
  consultant?: string | null;
  total_assignments?: number | string | null;
  completed_count?: number | string | null;
  pending_count?: number | string | null;
  status?: string | null;
}

export interface ListProjectSafetyReportsResponse {
  code?: string;
  message?: string | null;
  data?: ProjectSafetyReportDto[] | ProjectSafetyReportDto | null;
  payload?: ProjectSafetyReportDto[] | ProjectSafetyReportDto | null;
}

export function extractProjectSafetyReports(
  response: ListProjectSafetyReportsResponse | undefined,
): ProjectSafetyReportDto[] {
  if (!response) return [];

  const raw = response.data ?? response.payload;
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") return [raw];

  return [];
}
