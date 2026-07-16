export type ProjectNotificationScopeArgs =
  | { project_id: string; contractual_engagement_key?: never }
  | { contractual_engagement_key: string; project_id?: never };

export type ProjectNotificationsListArgs = ProjectNotificationScopeArgs & {
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
};

/** Mobile list endpoints do not require project_id; backend filters by current employee. */
export type ProjectNotificationsMobileListArgs = Omit<
  ProjectNotificationsListArgs,
  "project_id"
> & {
  project_id?: string;
};

export type ProjectNotificationsExportArgs = ProjectNotificationScopeArgs & {
  status?: string;
  severity?: string;
  notification_type?: string;
  work_type?: string;
  from_date?: string;
  to_date?: string;
  assigned_user_id?: string;
  search?: string;
};

export type ProjectNotificationsMapTasksArgs = ProjectNotificationScopeArgs & {
  status?: string;
  date_from?: string;
  date_to?: string;
};

export type ProjectNotificationsEmployeesLocationsArgs = ProjectNotificationScopeArgs & {
  latitude: number;
  longitude: number;
};

export type CreateProjectNotificationArgs = ProjectNotificationScopeArgs & {
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
  is_draft?: boolean;
};

export type UpdateProjectNotificationArgs = {
  [K in keyof CreateProjectNotificationArgs]?: CreateProjectNotificationArgs[K];
} & {
  id: string;
  project_id?: string;
  contractual_engagement_key?: string;
  files?: File[];
  deleted_media_ids?: (string | number)[];
};

export interface ProjectNotificationRejectArgs {
  rejection_reason: string;
}

export interface ProjectNotificationReadStatusArgs {
  is_read: boolean;
}

export interface ProjectNotificationMobileActionArgs {
  latitude?: number;
  longitude?: number;
  internal_procedure_setting_id?: string;
  notes?: string;
}

export interface ProjectNotificationReassignArgs {
  assigned_user_ids: string[];
}

export interface CreateProjectNotificationNoteArgs {
  note: string;
}

export interface CopySiteStatusUpdateArgs {
  notification_id: string;
  site_status_update_id: string;
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

/* ── Site Status Types ── */

export interface CreateSiteStatusTypeArgs {
  project_type_id: string | number;
  name_ar: string;
  name_en?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateSiteStatusTypeArgs {
  name_ar?: string;
  name_en?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface CreateSiteStatusTypeKeyArgs {
  site_status_type_id?: string;
  name_ar: string;
  name_en?: string;
  key?: string;
  field_type: "text" | "number" | "date" | "select";
  options?: string[] | null;
  show_in_site_status_updates?: boolean;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateSiteStatusTypeKeyArgs {
  name_ar?: string;
  name_en?: string;
  key?: string;
  field_type?: "text" | "number" | "date" | "select";
  options?: string[] | null;
  show_in_site_status_updates?: boolean;
  sort_order?: number;
  is_active?: boolean;
}
