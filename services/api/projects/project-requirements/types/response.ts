import type {
  ProjectRequirementIntervalType,
  ProjectRequirementRepetition,
  ProjectRequirementWeekDay,
} from "./params";

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
