export type ProjectNotificationScopeArgs =
  | { project_id: string; contractual_engagement_key?: never }
  | { contractual_engagement_key: string; project_id?: never };

export interface ProjectNotificationsListArgs extends ProjectNotificationScopeArgs {
  page?: number;
  per_page?: number;
  status?: string;
  severity?: string;
  notification_type?: string;
  work_type?: string;
  from_date?: string;
  to_date?: string;
  assigned_user_id?: string;
  search?: string;
}

/** Mobile list endpoints do not require project_id; backend filters by current employee. */
export interface ProjectNotificationsMobileListArgs
  extends Omit<ProjectNotificationsListArgs, "project_id"> {
  project_id?: string;
}

export interface ProjectNotificationsExportArgs
  extends ProjectNotificationScopeArgs {
  status?: string;
  severity?: string;
  notification_type?: string;
  work_type?: string;
  from_date?: string;
  to_date?: string;
  assigned_user_id?: string;
  search?: string;
}

export interface ProjectNotificationsMapTasksArgs
  extends ProjectNotificationScopeArgs {
  status?: string;
}

export interface ProjectNotificationsEmployeesLocationsArgs
  extends ProjectNotificationScopeArgs {
  latitude: number;
  longitude: number;
}

export interface CreateProjectNotificationArgs
  extends ProjectNotificationScopeArgs {
  notification_number?: string | null;
  notification_type: string;
  feeder_number?: string | null;
  work_description?: string | null;
  contractor_id?: string | null;
  contractor_name?: string | null;
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
  assigned_user_ids: string[];
  selected_distance_meters: number;
  independent_progress?: boolean;
  task_date?: string | null;
  duration_hours?: number | null;
  notes?: string | null;
  machine_number?: string | null;
}

export interface UpdateProjectNotificationArgs
  extends Partial<CreateProjectNotificationArgs> {
  id: string;
  files?: File[];
  deleted_media_ids?: (string | number)[];
}

export interface ProjectNotificationRejectArgs {
  rejection_reason: string;
}

export interface ProjectNotificationMobileActionArgs {
  latitude?: number;
  longitude?: number;
  internal_procedure_setting_id?: string;
  notes?: string;
}

export interface ProjectNotificationsChartsArgs {
  project_id?: string;
  contractual_engagement_key?: string;
  status?: string;
  notification_type?: string;
  severity?: string;
  work_type?: string;
  contractor_name?: string;
  contractor_id?: string;
  contractor_category?: string;
  assigned_user_id?: string;
  task_date?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}
