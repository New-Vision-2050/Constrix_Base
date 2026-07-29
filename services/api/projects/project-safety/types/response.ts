export interface ProjectSafetyViolationDto {
  id: string;
  code?: string | null;
  description?: string | null;
  category?: string | null;
  is_attached?: boolean | null;
  weight?: number | null;
}

export interface ProjectSafetyMorphableDto {
  display?: string | null;
  type?: string | null;
}

export interface ProjectSafetyAssignedUserDto {
  id?: string | null;
  name?: string | null;
  consultant?: string | null;
}

export interface ProjectSafetyRecordDto {
  id: string;
  morphable?: ProjectSafetyMorphableDto | null;
  assigned_user?: ProjectSafetyAssignedUserDto | null;
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
  status?: string | null;
  project_id?: string | null;
  all_violations?: ProjectSafetyViolationDto[] | null;
}

export interface ProjectSafetyVisitsListPagination {
  page: number;
  next_page: number | null;
  last_page: number;
  result_count: number;
}

export interface ListProjectSafetyVisitsResponse {
  code?: string;
  message?: string | null;
  data?: ProjectSafetyRecordDto[] | ProjectSafetyRecordDto | null;
  payload?: ProjectSafetyRecordDto[] | ProjectSafetyRecordDto | null;
  pagination?: ProjectSafetyVisitsListPagination;
  last_page?: number;
  total?: number;
}

export function extractProjectSafetyRecords(
  response: ListProjectSafetyVisitsResponse | undefined,
): ProjectSafetyRecordDto[] {
  if (!response) return [];

  const raw = response.data ?? response.payload;
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") return [raw];

  return [];
}

/** @deprecated Use ListProjectSafetyVisitsResponse */
export type ListProjectSafetyResponse = ListProjectSafetyVisitsResponse;

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

export interface SafetyAnalyticsOverallDto {
  average_percentage?: number | string | null;
  total_evaluations?: number | string | null;
  completed_evaluations?: number | string | null;
  pending_evaluations?: number | string | null;
}

export interface SafetyAnalyticsCompliantDto {
  project_id?: string | null;
  compliant_locations?: number | string | null;
  total_locations?: number | string | null;
  is_project_compliant?: boolean | null;
}

export interface SafetyAnalyticsViolationItemDto {
  id?: string | null;
  code?: string | null;
  description?: string | null;
  category?: string | null;
  default_weight?: number | string | null;
  count?: number | string | null;
}

export interface SafetyAnalyticsViolationPerformanceDto {
  id?: string | null;
  code?: string | null;
  description?: string | null;
  category?: string | null;
  total_evaluations?: number | string | null;
  violation_found_count?: number | string | null;
  no_violation_count?: number | string | null;
  not_applicable_count?: number | string | null;
  compliance_rate?: number | string | null;
}

export interface SafetyAnalyticsContractorConsultantDto {
  contractor_id?: string | null;
  contractor_name?: string | null;
  consultant?: string | null;
  consultant_engineer?: string | null;
  violation_count?: number | string | null;
}

type SinglePayloadResponse<T> = {
  code?: string;
  message?: string | null;
  payload?: T | null;
  data?: T | null;
};

type ListPayloadResponse<T> = {
  code?: string;
  message?: string | null;
  payload?: T[] | null;
  data?: T[] | null;
};

export type SafetyAnalyticsOverallResponse =
  SinglePayloadResponse<SafetyAnalyticsOverallDto>;
export type SafetyAnalyticsCompliantResponse =
  SinglePayloadResponse<SafetyAnalyticsCompliantDto>;
export type SafetyAnalyticsFrequentViolationsResponse =
  ListPayloadResponse<SafetyAnalyticsViolationItemDto>;
export type SafetyAnalyticsViolationPerformanceResponse =
  ListPayloadResponse<SafetyAnalyticsViolationPerformanceDto>;
export type SafetyAnalyticsByContractorConsultantResponse =
  ListPayloadResponse<SafetyAnalyticsContractorConsultantDto>;
export type SafetyAnalyticsTopViolationsResponse =
  ListPayloadResponse<SafetyAnalyticsViolationItemDto>;

export function extractSinglePayload<T>(
  response: SinglePayloadResponse<T> | undefined,
): T | null {
  if (!response) return null;
  return response.payload ?? response.data ?? null;
}

export function extractListPayload<T>(
  response: ListPayloadResponse<T> | undefined,
): T[] {
  if (!response) return [];
  const raw = response.payload ?? response.data;
  return Array.isArray(raw) ? raw : [];
}

/** Placeholder types for the التقارير tab — wire when API is available. */
export type ProjectSafetyReportsTabDto = Record<string, never>;

export type ListProjectSafetyReportsTabResponse = {
  code?: string;
  message?: string | null;
  data?: ProjectSafetyReportsTabDto[] | null;
  payload?: ProjectSafetyReportsTabDto[] | null;
};
