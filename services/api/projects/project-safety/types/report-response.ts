export interface ProjectSafetyReportDto {
  id: string;
  order_number?: string | null;
  order_permit_num?: string | null;
  notification_num?: string | null;
  "order_permit_num/notification_num"?: string | null;
  order_status?: string | null;
  status?: string | null;
  order_status_label?: string | null;
  status_label?: string | null;
  safety_visits_count?: number | string | null;
  visits_count?: number | string | null;
  observations_count?: number | string | null;
  notes_count?: number | string | null;
  site_visit_forms_count?: number | string | null;
  forms_count?: number | string | null;
  contractor_name?: string | null;
  contractor?: string | null;
  consultant_name?: string | null;
  consultant?: string | null;
  engineer_name?: string | null;
  consultant_engineer?: string | null;
  engineer?: string | null;
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
