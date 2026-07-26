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
