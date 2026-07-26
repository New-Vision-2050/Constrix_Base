import { ApiBaseResponse } from "@/types/common/response/base";

export type UUID = string;

export type AttachmentRequestChartStatus =
  | "pending"
  | "semi-approved"
  | "approved"
  | "declined";

export type RequirementSubmissionStatus =
  | "pending"
  | "approved"
  | "declined";

export type ChartDirection = "incoming" | "outgoing";

export type AttachmentRequestItemStatus =
  | "pending"
  | "approved"
  | "declined"
  | "update_requested";

export type StandardChartType =
  | "status"
  | "direction"
  | "procedure"
  | "attachment_type"
  | "item_status"
  | "file_type"
  | "project"
  | "requirement";

export interface ChartItem {
  code: string;
  label: string;
  count: number;
  percentage: number;
}

export interface TrendItem {
  month: string;
  count: number;
}

export interface Chart<TChartType extends StandardChartType = StandardChartType> {
  chart_type: TChartType;
  total: number;
  data: ChartItem[];
}

export interface TrendChart {
  chart_type: "trend";
  total: number;
  data: TrendItem[];
}

export type AnyKnownChart = Chart | TrendChart;

export interface AttachmentRequestsSummary {
  total_requests: number;
  total_items: number;
  pending_requests: number;
  semi_approved_requests: number;
  approved_requests: number;
  declined_requests: number;
  outgoing_requests: number;
  incoming_requests: number;
}

export interface RequirementSubmissionsSummary {
  total_submissions: number;
  total_files: number;
  pending_submissions: number;
  approved_submissions: number;
  declined_submissions: number;
  outgoing_submissions: number;
  incoming_submissions: number;
}

export interface AttachmentRequestsSection {
  summary?: AttachmentRequestsSummary;
  status?: Chart<"status">;
  direction?: Chart<"direction">;
  procedure?: Chart<"procedure">;
  attachment_type?: Chart<"attachment_type">;
  item_status?: Chart<"item_status">;
  file_type?: Chart<"file_type">;
  project?: Chart<"project">;
  trend?: TrendChart;
}

export interface RequirementSubmissionsSection {
  summary?: RequirementSubmissionsSummary;
  status?: Chart<"status">;
  direction?: Chart<"direction">;
  procedure?: Chart<"procedure">;
  requirement?: Chart<"requirement">;
  file_type?: Chart<"file_type">;
  project?: Chart<"project">;
  trend?: TrendChart;
}

export interface AttachmentRequestChartsPayload {
  attachment_requests?: AttachmentRequestsSection;
  requirement_submissions?: RequirementSubmissionsSection;
}

export interface AttachmentRequestChartsResponse
  extends ApiBaseResponse<AttachmentRequestChartsPayload> {}

export interface AttachmentRequestChartsFilters {
  project_id?: UUID;
  contractual_engagement_key?: string;
  direction?: ChartDirection;
  type?: string;
  status?: string;
  procedure_setting_id?: UUID;
  project_requirement_id?: UUID;
  attachment_type_id?: UUID;
  item_status?: string;
  file_type?: string;
  date_from?: string;
  date_to?: string;
  name?: string;
}
