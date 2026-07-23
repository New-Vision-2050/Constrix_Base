export interface ProjectSafetyViolationDto {
  id: string;
  code?: string | null;
  description?: string | null;
  category?: string | null;
  is_attached?: boolean | null;
  weight?: number | null;
}

export interface ProjectSafetyRecordDto {
  id: string;
  order_permit_num?: string | null;
  notification_num?: string | null;
  /** Some API responses use a combined field name. */
  "order_permit_num/notification_num"?: string | null;
  order_type?: string | null;
  date?: string | null;
  time?: string | null;
  required_score?: number | string | null;
  earned_score?: number | string | null;
  percentage?: number | string | null;
  consultant_engineer?: string | null;
  consultant?: string | null;
  contractor_id?: string | null;
  contractor_name?: string | null;
  contractor?: string | null;
  all_violations?: ProjectSafetyViolationDto[] | null;
}

/** API returns list items under `data` (not `payload`). */
export interface ListProjectSafetyResponse {
  code?: string;
  message?: string | null;
  data?: ProjectSafetyRecordDto[] | ProjectSafetyRecordDto | null;
  /** Legacy / alternate envelope — kept for compatibility. */
  payload?: ProjectSafetyRecordDto[] | ProjectSafetyRecordDto | null;
}

export function extractProjectSafetyRecords(
  response: ListProjectSafetyResponse | undefined,
): ProjectSafetyRecordDto[] {
  if (!response) return [];

  const raw = response.data ?? response.payload;
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") return [raw];

  return [];
}
