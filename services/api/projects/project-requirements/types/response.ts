import type {
  ProjectRequirementIntervalType,
  ProjectRequirementRepetition,
  ProjectRequirementWeekDay,
} from "./params";

export type ProjectRequirementUploadDisabledReason =
  | "already_submitted"
  | "outside_repeat_days"
  | "missing_permission"
  | "not_assigned"
  | "invalid_repetition"
  | string
  | null;

export interface ProjectRequirementSubmissionFile {
  id: number | string;
  name?: string | null;
  file_name?: string | null;
  mime_type?: string | null;
  size?: number | null;
  url?: string | null;
  created_at?: string | null;
}

export interface ProjectRequirementSubmissionDto {
  id: string;
  project_id?: string | null;
  project_requirement_id?: string | null;
  submitted_at?: string | null;
  files?: ProjectRequirementSubmissionFile[] | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ProjectRequirementUploadStatus {
  can_upload: boolean;
  disabled_reason?: ProjectRequirementUploadDisabledReason;
  current_period_key?: string | null;
  period_starts_at?: string | null;
  period_ends_at?: string | null;
  next_available_at?: string | null;
  latest_submission?: ProjectRequirementSubmissionDto | null;
}

export interface ProjectRequirementDto {
  id: string | number;
  requirement_code?: string | null;
  required_document_name?: string | null;
  document?: string | null;
  document_type?: string | null;
  document_type_id?: string | number | null;
  specialization?: string | null;
  specialization_id?: string | number | null;
  stage?: string | null;
  sending_entity?: string | null;
  sending_entity_id?: string | number | null;
  review_entity?: string | null;
  review_entity_id?: string | number | null;
  receiver_company_ids?: string[] | null;
  repetition?: ProjectRequirementRepetition | string | null;
  repetition_interval_type?: ProjectRequirementIntervalType | string | null;
  repeat_days?: ProjectRequirementWeekDay[] | string[] | null;
  evaluation_status?: string | null;
  resulting_document?: string | null;
  completion_percentage?: number | string | null;
  upload_status?: ProjectRequirementUploadStatus | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ListProjectRequirementsResponse {
  code?: string;
  message?: string | null;
  payload?: ProjectRequirementDto[];
  data?: ProjectRequirementDto[];
  pagination?: {
    page?: number;
    next_page?: number;
    last_page?: number;
    result_count?: number;
  };
  current_page?: number;
  per_page?: number;
  total?: number;
  last_page?: number;
}

export interface CreateProjectRequirementsResponse {
  code?: string;
  message?: string | null;
  payload?: ProjectRequirementDto[] | ProjectRequirementDto | null;
  data?: ProjectRequirementDto[] | ProjectRequirementDto | null;
}

export interface GetProjectRequirementResponse {
  code?: string;
  message?: string | null;
  payload?: ProjectRequirementDto | null;
  data?: ProjectRequirementDto | null;
}

export interface CreateProjectRequirementSubmissionResponse {
  code?: string;
  message?: string | null;
  payload?: ProjectRequirementSubmissionDto | null;
  data?: ProjectRequirementSubmissionDto | null;
  errors?: Record<string, string[]>;
}

export interface ListProjectRequirementSubmissionsResponse {
  code?: string;
  message?: string | null;
  payload?: ProjectRequirementSubmissionDto[];
  data?: ProjectRequirementSubmissionDto[];
}
