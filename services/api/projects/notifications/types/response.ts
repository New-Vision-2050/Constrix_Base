import type { ApiBaseResponse } from "@/types/common/response/base";

export type NotificationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "in_progress"
  | "completed"
  | "cancelled";

export type NotificationSeverity = "low" | "medium" | "high" | "critical";

export interface ProjectNotificationUser {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
}

export interface ProjectNotificationLocation {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  source?: string | null;
}

export interface ProjectNotificationContractor {
  id: string;
  name: string;
  number: string;
  mobile?: string | null;
  notes?: string | null;
}

export interface ProjectNotificationEmployee {
  user_id: string;
  name: string;
  status: "available" | "busy" | "no_location" | "offline";
  status_label: string;
  distance_meters: number;
  distance_label: string;
  last_update?: string | null;
  location?: ProjectNotificationLocation | null;
  attendance?: Record<string, unknown> | null;
  branch?: string | null;
  branch_id?: string | number | null;
}

export interface ProjectNotificationAttachment {
  id?: string | number | null;
  url: string;
  name?: string | null;
  mime_type?: string | null;
  type?: string | null;
  size?: number | null;
}

export interface ProjectNotificationProcedureAttachmentGroup {
  title: string;
  attachments: ProjectNotificationAttachment[];
}

export interface ProjectNotificationEmployeeTask {
  id: string;
  serial_number: string;
  status: string;
  status_label?: string | null;
  title: string;
  task_date: string;
  duration_hours: string | number;
  user: ProjectNotificationUser;
  attachments: ProjectNotificationAttachment[];
  procedure_attachments: ProjectNotificationProcedureAttachmentGroup[];
}

export interface ProjectNotification {
  id: string;
  project_id: string;
  notification_number: string | null;
  notification_type: string;
  severity: NotificationSeverity;
  feeder_number: string;
  work_type: string;
  work_description: string;
  contractor_id?: string | null;
  contractor_name: string;
  contractor_technical_name?: string | null;
  contractor_technical_number?: string | null;
  contractor_category?: string | null;
  contractor_notes?: string | null;
  permit_source?: string | null;
  permit_recipient?: string | null;
  task_latitude: number;
  task_longitude: number;
  location_radius: number;
  location_link?: string | null;
  repair_point: string;
  assigned_user_id: string;
  selected_distance_meters: number;
  assigned_user: ProjectNotificationUser;
  task_date: string;
  duration_hours: number;
  notes?: string | null;
  status: NotificationStatus;
  status_label?: string | null;
  violations_count: number;
  magdy_number?: string | null;
  machine_number?: string | null;
  internal_procedure_setting_id?: string | null;
  pending_processes?: unknown[];
  employee_task?: ProjectNotificationEmployeeTask | null;
  attachments?: ProjectNotificationAttachment[];
  procedure_attachments?: ProjectNotificationProcedureAttachmentGroup[];
  created_by?: ProjectNotificationUser | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectNotificationsListPagination {
  page: number;
  next_page: number | null;
  last_page: number;
  result_count: number;
}

export interface ProjectNotificationsListResponse
  extends ApiBaseResponse<ProjectNotification[]> {
  pagination?: ProjectNotificationsListPagination;
}

export interface ProjectNotificationSingleResponse
  extends ApiBaseResponse<ProjectNotification[]> {}

export interface ProjectNotificationContractorsResponse
  extends ApiBaseResponse<ProjectNotificationContractor[]> {}

export interface ProjectNotificationEmployeesLocationsResponse
  extends ApiBaseResponse<ProjectNotificationEmployee[]> {}

export interface ProjectNotificationType {
  id: string;
  value: string;
  name_ar: string;
  name_en: string;
  sort_order: number;
  is_active: boolean;
}

export interface ProjectNotificationTypesResponse
  extends ApiBaseResponse<ProjectNotificationType[]> {}

export interface ProjectNotificationDeleteResponse {
  code?: string;
  message?: string;
}

/** Alias for mobile task list responses (same shape as dashboard list). */
export type ProjectNotificationMyTasksResponse = ProjectNotificationsListResponse;

/** Alias for mobile inbox list responses. */
export type ProjectNotificationMyInboxResponse = ProjectNotificationsListResponse;

export interface ProjectNotificationInboxCounts {
  pending?: number;
  approved?: number;
  in_progress?: number;
  completed?: number;
  rejected?: number;
  cancelled?: number;
  total?: number;
}

export interface ProjectNotificationMyInboxCountsResponse
  extends ApiBaseResponse<ProjectNotificationInboxCounts> {}

export interface ProjectNotificationFilterOption {
  value: string;
  label: string;
}

export interface ProjectNotificationFilters {
  statuses?: ProjectNotificationFilterOption[];
  projects?: ProjectNotificationFilterOption[];
  duration?: {
    min?: number;
    max?: number;
  };
}

export interface ProjectNotificationFiltersResponse
  extends ApiBaseResponse<ProjectNotificationFilters> {}

export interface ProjectNotificationAvailableActionForm {
  key: string;
  label_ar: string;
}

export interface ProjectNotificationAvailableActionCondition {
  key: string;
  settings: unknown;
  is_active: boolean;
  sort_order: number;
}

export interface ProjectNotificationAvailableAction {
  id: string;
  name: string;
  form: ProjectNotificationAvailableActionForm;
  conditions: ProjectNotificationAvailableActionCondition[];
  appears_before_ids: string[];
  appears_after_ids: string[];
  sort_order: number;
}

export interface ProjectNotificationAvailableActionsResponse
  extends ApiBaseResponse<ProjectNotificationAvailableAction[]> {}

/* ── Site Status Updates ── */

export interface SiteStatusUpdateAttachment {
  id: string;
  url: string;
  mime_type?: string | null;
  size?: number | null;
  name?: string | null;
}

export interface SiteStatusUpdateUser {
  id: string;
  name: string;
}

export interface SiteStatusUpdateStep {
  step_order: number;
  name?: string | null;
  status: string;
  action_by?: SiteStatusUpdateUser | null;
  acted_at?: string | null;
}

export interface SiteStatusUpdateProcess {
  id: string;
  status: string;
  steps: SiteStatusUpdateStep[];
}

export interface SiteStatusUpdate {
  id: string;
  status: string;
  description: string;
  attachments: SiteStatusUpdateAttachment[];
  requested_by: SiteStatusUpdateUser;
  reviewed_by?: SiteStatusUpdateUser | null;
  reviewed_at?: string | null;
  review_notes?: string | null;
  created_at: string;
  process?: SiteStatusUpdateProcess | null;
}

export interface SiteStatusUpdateSummary {
  total: number;
  approved: number;
  pending: number;
}

export interface SiteStatusUpdatesData {
  items: SiteStatusUpdate[];
  summary: SiteStatusUpdateSummary;
}

export interface SiteStatusUpdatesResponse {
  data: SiteStatusUpdatesData;
  message?: string;
}
