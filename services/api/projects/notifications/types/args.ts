export interface ProjectNotificationsListArgs {
  project_id: string;
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

export interface ProjectNotificationsExportArgs {
  project_id: string;
  status?: string;
  severity?: string;
  notification_type?: string;
  work_type?: string;
  from_date?: string;
  to_date?: string;
  assigned_user_id?: string;
  search?: string;
}

export interface ProjectNotificationsEmployeesLocationsArgs {
  project_id: string;
  latitude: number;
  longitude: number;
}

export interface CreateProjectNotificationArgs {
  project_id: string;
  notification_number?: string | null;
  notification_type: string;
  feeder_number?: string | null;
  work_description?: string | null;
  contractor_id?: string | null;
  contractor_name?: string | null;
  contractor_number?: string | null;
  contractor_technical_name?: string | null;
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
  task_date?: string | null;
  duration_hours?: number | null;
  notes?: string | null;
}

export interface UpdateProjectNotificationArgs
  extends Partial<CreateProjectNotificationArgs> {
  id: string;
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
