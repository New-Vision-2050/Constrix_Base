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
}

export interface ProjectNotification {
  id: string;
  project_id: string;
  notification_number: string | null;
  notification_type: string;
  severity: NotificationSeverity;
  magdy_number: string;
  work_type: string;
  work_description: string;
  contractor_name: string;
  contractor_number?: string | null;
  contractor_technical_number?: string | null;
  contractor_category?: string | null;
  contractor_notes?: string | null;
  contractor_mobile?: string | null;
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
  violations_count: number;
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

export interface ProjectNotificationEmployeesLocationsResponse
  extends ApiBaseResponse<ProjectNotificationEmployee[]> {}

export interface ProjectNotificationDeleteResponse {
  code?: string;
  message?: string;
}
