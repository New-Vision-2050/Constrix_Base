export type ProjectRequirementRepetition =
  | "once"
  | "daily"
  | "weekly"
  | "monthly";

export type ProjectRequirementIntervalType = "day" | "week" | "month";

export type ProjectRequirementWeekDay =
  | "saturday"
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday";

export interface CreateProjectRequirementArgs {
  requirement_code: string;
  required_document_name: string;
  document: string;
  document_type: string;
  document_type_id?: string | null;
  specialization?: string | null;
  specialization_id?: string | null;
  stage: string;
  sending_entity: string;
  sending_entity_id?: string | null;
  review_entity: string;
  review_entity_id?: string | null;
  receiver_company_ids?: string[];
  repetition: ProjectRequirementRepetition;
  repetition_interval_type?: ProjectRequirementIntervalType;
  repeat_days?: ProjectRequirementWeekDay[];
  evaluation_status?: string;
  resulting_document?: string | null;
  completion_percentage?: number;
}

export interface CreateProjectRequirementsArgs {
  requirements: CreateProjectRequirementArgs[];
}

export interface ListProjectRequirementsParams {
  page?: number;
  per_page?: number;
  search?: string;
}
