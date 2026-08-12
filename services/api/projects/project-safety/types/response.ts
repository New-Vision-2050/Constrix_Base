export interface ProjectSafetyViolationEvidenceDto {
  id: number;
  name: string;
  file_name: string;
  mime_type: string;
  size: number;
  url: string;
}

export interface ProjectSafetyViolationDto {
  id: string;
  code?: string | null;
  description?: string | null;
  category?: string | null;
  is_attached?: boolean | null;
  weight?: string | number | null;
  action?: string | null;
  evidence?: ProjectSafetyViolationEvidenceDto[] | null;
  status?: number | null;
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

/** Generated weekly safety report row (التقارير tab). */
export interface ProjectSafetyWeeklyReportDto {
  id?: string | number | null;
  serial_number?: string | number | null;
  project_id?: string | null;
  company_id?: string | null;
  name?: string | null;
  title?: string | null;
  from_date?: string | null;
  to_date?: string | null;
  status?: string | null;
  file_size?: number | string | null;
  generated_at?: string | null;
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  download_url?: string | null;
  has_file?: boolean | null;
  file_url?: string | null;
  url?: string | null;
  report_url?: string | null;
}

export type ListProjectSafetyWeeklyReportsResponse = {
  code?: string;
  message?: string | null;
  data?: ProjectSafetyWeeklyReportDto[] | ProjectSafetyWeeklyReportDto | null;
  payload?: ProjectSafetyWeeklyReportDto[] | ProjectSafetyWeeklyReportDto | null;
};

export function extractProjectSafetyWeeklyReports(
  response: ListProjectSafetyWeeklyReportsResponse | undefined,
): ProjectSafetyWeeklyReportDto[] {
  if (!response) return [];

  const raw = response.payload ?? response.data;
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") return [raw];

  return [];
}

/** @deprecated Use ProjectSafetyWeeklyReportDto */
export type ProjectSafetyReportsTabDto = ProjectSafetyWeeklyReportDto;

/** @deprecated Use ListProjectSafetyWeeklyReportsResponse */
export type ListProjectSafetyReportsTabResponse =
  ListProjectSafetyWeeklyReportsResponse;
