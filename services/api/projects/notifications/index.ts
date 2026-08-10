import { baseApi } from "@/config/axios/instances/base";
import type {
  CopySiteStatusUpdateArgs,
  CreateProjectNotificationArgs,
  CreateProjectNotificationNoteArgs,
  CreateSiteStatusTypeArgs,
  CreateSiteStatusTypeKeyArgs,
  ProjectNotificationsChartsArgs,
  ProjectNotificationsEmployeesLocationsArgs,
  ProjectNotificationsExportArgs,
  ProjectNotificationsListArgs,
  ProjectNotificationsMapTasksArgs,
  ProjectNotificationsMobileListArgs,
  ConfirmLocationArgs,
  EndTaskArgs,
  ProjectNotificationMobileActionArgs,
  ProjectNotificationReadStatusArgs,
  ProjectNotificationReassignArgs,
  ProjectNotificationRejectArgs,
  ProjectNotificationScopeArgs,
  RequestSafetyViolationArgs,
  RequestSiteStatusUpdateArgs,
  UpdateProjectNotificationArgs,
  UpdateSiteStatusTypeArgs,
  UpdateSiteStatusTypeKeyArgs,
} from "./types/args";
import type {
  NotificationChartsResponse,
  ProjectNotificationAvailableActionsResponse,
  ProjectNotificationContractorsResponse,
  ProjectNotificationDeleteResponse,
  ProjectNotificationEmployeesLocationsResponse,
  ProjectNotificationFiltersResponse,
  ProjectNotificationMapTasksResponse,
  ProjectNotificationMyInboxCountsResponse,
  ProjectNotificationMyInboxResponse,
  ProjectNotificationMyTasksResponse,
  ProjectNotificationNoteSingleResponse,
  ProjectNotificationNotesResponse,
  ProjectNotificationSingleResponse,
  ProjectNotificationTypesResponse,
  ProjectNotificationsListResponse,
  SiteStatusTypeKeysResponse,
  SiteStatusTypeSingleResponse,
  SiteStatusTypesResponse,
  EndTaskStatusesResponse,
  SiteStatusUpdatesResponse,
} from "./types/response";

export type {
  ProjectNotification,
  ProjectNotificationContractor,
  ProjectNotificationEmployee,
  ProjectNotificationType,
  ProjectNotificationUser,
  ProjectNotificationLocation,
  NotificationSeverity,
  NotificationStatus,
} from "./types/response";

export const ProjectNotificationsApi = {
  getList: (args: ProjectNotificationsListArgs) =>
    baseApi.get<ProjectNotificationsListResponse>("projects/notifications", {
      params: args,
    }),

  create: (args: CreateProjectNotificationArgs) =>
    baseApi.post<ProjectNotificationSingleResponse>("projects/notifications", args),

  getById: (id: string, scope?: ProjectNotificationScopeArgs) =>
    baseApi.get<ProjectNotificationSingleResponse>(
      `projects/notifications/${encodeURIComponent(id)}`,
      { params: scope },
    ),

  update: (id: string, args: UpdateProjectNotificationArgs) => {
    const { files, deleted_media_ids, ...rest } = args;
    const hasFiles = files && files.length > 0;
    const hasDeletedMedia = deleted_media_ids && deleted_media_ids.length > 0;

    if (hasFiles || hasDeletedMedia) {
      const formData = new FormData();
      Object.entries(rest).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (typeof value === "number" || typeof value === "boolean") {
          formData.append(key, String(value));
        } else {
          formData.append(key, value as string);
        }
      });
      if (hasFiles) {
        files!.forEach((file) => formData.append("files[]", file));
      }
      if (hasDeletedMedia) {
        deleted_media_ids!.forEach((mediaId) =>
          formData.append("deleted_media_ids[]", String(mediaId)),
        );
      }
      return baseApi.put<ProjectNotificationSingleResponse>(
        `projects/notifications/${encodeURIComponent(id)}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
    }

    return baseApi.put<ProjectNotificationSingleResponse>(
      `projects/notifications/${encodeURIComponent(id)}`,
      rest,
    );
  },

  delete: (id: string) =>
    baseApi.delete<ProjectNotificationDeleteResponse>(
      `projects/notifications/${encodeURIComponent(id)}`,
    ),

  approve: (id: string) =>
    baseApi.post<ProjectNotificationSingleResponse>(
      `projects/notifications/${encodeURIComponent(id)}/approve`,
    ),

  reject: (id: string, args: ProjectNotificationRejectArgs) =>
    baseApi.post<ProjectNotificationSingleResponse>(
      `projects/notifications/${encodeURIComponent(id)}/reject`,
      args,
    ),

  readStatus: (id: string, args: ProjectNotificationReadStatusArgs) =>
    baseApi.post<ProjectNotificationSingleResponse>(
      `projects/notifications/${encodeURIComponent(id)}/read-status`,
      args,
    ),

  export: (args: ProjectNotificationsExportArgs) =>
    baseApi.post<Blob>("projects/notifications/export", args, {
      responseType: "blob",
    }),

  getContractors: () =>
    baseApi.get<ProjectNotificationContractorsResponse>(
      "projects/notifications/contractors",
    ),

  getEmployeesWithLocations: (
    args: ProjectNotificationsEmployeesLocationsArgs,
  ) =>
    baseApi.get<ProjectNotificationEmployeesLocationsResponse>(
      "projects/notifications/employees-with-locations",
      { params: args },
    ),

  getMapTasks: (args: ProjectNotificationsMapTasksArgs) =>
    baseApi.get<ProjectNotificationMapTasksResponse>(
      "projects/notifications/map-tasks",
      { params: args },
    ),

  getAvailableActions: (id: string) =>
    baseApi.get<ProjectNotificationAvailableActionsResponse>(
      `projects/notifications/${encodeURIComponent(id)}/available-actions`,
    ),

  confirmReceive: (id: string, args: ProjectNotificationMobileActionArgs) =>
    baseApi.post<ProjectNotificationSingleResponse>(
      `projects/notifications/${encodeURIComponent(id)}/confirm-receive`,
      args,
    ),

  /** Legacy alias for confirmReceive. Prefer confirmReceive. */
  startTask: (id: string, args: ProjectNotificationMobileActionArgs) =>
    baseApi.post<ProjectNotificationSingleResponse>(
      `projects/notifications/${encodeURIComponent(id)}/start`,
      args,
    ),

  takeAction: (id: string, args: ProjectNotificationMobileActionArgs) =>
    baseApi.post<ProjectNotificationSingleResponse>(
      `projects/notifications/${encodeURIComponent(id)}/take-action`,
      args,
    ),

  confirmLocation: (id: string, args: ConfirmLocationArgs) => {
    const formData = new FormData();
    formData.append("latitude", String(args.latitude));
    formData.append("longitude", String(args.longitude));
    formData.append("distance_meters", String(args.distance_meters));
    formData.append("is_inside_location", String(args.is_inside_location));
    return baseApi.post<ProjectNotificationSingleResponse>(
      `projects/notifications/${encodeURIComponent(id)}/confirm-location`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  getEndTaskStatuses: () =>
    baseApi.get<EndTaskStatusesResponse>(
      "projects/notifications/end-task-statuses",
    ),

  endTask: (id: string, args: EndTaskArgs) => {
    const formData = new FormData();
    formData.append("status_id", args.status_id);
    formData.append("latitude", String(args.latitude));
    formData.append("longitude", String(args.longitude));
    if (args.notes) {
      formData.append("notes", args.notes);
    }
    if (args.internal_procedure_setting_id) {
      formData.append(
        "internal_procedure_setting_id",
        args.internal_procedure_setting_id,
      );
    }
    args.files?.forEach((file) => formData.append("files[]", file));
    return baseApi.post<ProjectNotificationSingleResponse>(
      `projects/notifications/${encodeURIComponent(id)}/end`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  requestSiteStatusUpdate: (id: string, args: RequestSiteStatusUpdateArgs) => {
    const formData = new FormData();
    formData.append("description", args.description);
    if (args.internal_procedure_setting_id) {
      formData.append(
        "internal_procedure_setting_id",
        args.internal_procedure_setting_id,
      );
    }
    args.files?.forEach((file) => formData.append("files[]", file));
    if (args.current_latitude != null) {
      formData.append("current_latitude", String(args.current_latitude));
    }
    if (args.current_longitude != null) {
      formData.append("current_longitude", String(args.current_longitude));
    }
    if (args.update_date) {
      formData.append("update_date", args.update_date);
    }
    if (args.update_time) {
      formData.append("update_time", args.update_time);
    }
    if (args.current_site_status_id) {
      formData.append("current_site_status_id", args.current_site_status_id);
    }
    return baseApi.post<ProjectNotificationSingleResponse>(
      `projects/notifications/${encodeURIComponent(id)}/request-site-status-update`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  requestSafetyViolation: (id: string, args: RequestSafetyViolationArgs) => {
    const formData = new FormData();
    formData.append(
      "internal_procedure_setting_id",
      args.internal_procedure_setting_id,
    );

    if (args.current_latitude != null) {
      formData.append("current_latitude", String(args.current_latitude));
    }
    if (args.current_longitude != null) {
      formData.append("current_longitude", String(args.current_longitude));
    }

    args.violations.forEach((violation, index) => {
      formData.append(
        `violations[${index}][violation_id]`,
        violation.violation_id,
      );
      formData.append(`violations[${index}][status]`, violation.status);
      violation.images?.forEach((file, imageIndex) => {
        formData.append(`violations[${index}][images][${imageIndex}]`, file);
      });
    });

    return baseApi.post<ProjectNotificationSingleResponse>(
      `projects/notifications/${encodeURIComponent(id)}/request-safety-violation`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  myTasks: (args?: ProjectNotificationsMobileListArgs) =>
    baseApi.get<ProjectNotificationMyTasksResponse>(
      "projects/notifications/my-tasks",
      { params: args },
    ),

  myInbox: (args?: ProjectNotificationsMobileListArgs) =>
    baseApi.get<ProjectNotificationMyInboxResponse>(
      "projects/notifications/my-inbox",
      { params: args },
    ),

  myInboxCounts: () =>
    baseApi.get<ProjectNotificationMyInboxCountsResponse>(
      "projects/notifications/my-inbox-counts",
    ),

  getFilters: () =>
    baseApi.get<ProjectNotificationFiltersResponse>(
      "projects/notifications/filters",
    ),

  getNotificationTypes: () =>
    baseApi.get<ProjectNotificationTypesResponse>(
      "projects/notifications/notification-types",
    ),

  getSiteStatusTypesWithKeys: (args: {
    project_type_id?: string | number;
    project_id?: string;
    notification_type_id?: string;
  }) =>
    baseApi.get<SiteStatusTypesResponse>("projects/notifications/site-status-types", {
      params: args,
    }),

  getSiteStatusTypesWithKeysEndpoint: (args: {
    project_type_id?: string | number;
    project_id?: string;
    notification_type_id?: string;
  }) =>
    baseApi.get<SiteStatusTypesResponse>("projects/notifications/site-status-types/with-keys", {
      params: args,
    }),

  getSiteStatusTypeById: (id: string) =>
    baseApi.get<SiteStatusTypeSingleResponse>(`projects/notifications/site-status-types/${encodeURIComponent(id)}`),

  createSiteStatusType: (args: CreateSiteStatusTypeArgs) =>
    baseApi.post<SiteStatusTypeSingleResponse>("projects/notifications/site-status-types", args),

  updateSiteStatusType: (id: string, args: UpdateSiteStatusTypeArgs) =>
    baseApi.put<SiteStatusTypeSingleResponse>(
      `projects/notifications/site-status-types/${encodeURIComponent(id)}`,
      args,
    ),

  deleteSiteStatusType: (id: string) =>
    baseApi.delete<ProjectNotificationDeleteResponse>(
      `projects/notifications/site-status-types/${encodeURIComponent(id)}`,
    ),

  getSiteStatusTypeKeys: (siteStatusTypeId: string) =>
    baseApi.get<SiteStatusTypeKeysResponse>(
      `projects/notifications/site-status-types/${encodeURIComponent(siteStatusTypeId)}/keys`,
    ),

  createSiteStatusTypeKey: (
    siteStatusTypeId: string,
    args: CreateSiteStatusTypeKeyArgs,
  ) =>
    baseApi.post<SiteStatusTypeKeysResponse>(
      `projects/notifications/site-status-types/${encodeURIComponent(siteStatusTypeId)}/keys`,
      args,
    ),

  updateSiteStatusTypeKey: (
    siteStatusTypeId: string,
    keyId: string,
    args: UpdateSiteStatusTypeKeyArgs,
  ) =>
    baseApi.put<SiteStatusTypeKeysResponse>(
      `projects/notifications/site-status-types/${encodeURIComponent(siteStatusTypeId)}/keys/${encodeURIComponent(keyId)}`,
      args,
    ),

  deleteSiteStatusTypeKey: (siteStatusTypeId: string, keyId: string) =>
    baseApi.delete<ProjectNotificationDeleteResponse>(
      `projects/notifications/site-status-types/${encodeURIComponent(siteStatusTypeId)}/keys/${encodeURIComponent(keyId)}`,
    ),

  getSiteStatusUpdates: (notificationId: string) =>
    baseApi.get<SiteStatusUpdatesResponse>(
      `projects/notifications/${encodeURIComponent(notificationId)}/site-status-updates`,
    ),

  getCopiedSiteStatusUpdates: (notificationId: string) =>
    baseApi.get<SiteStatusUpdatesResponse>(
      `projects/notifications/${encodeURIComponent(notificationId)}/site-status-updates/copied`,
    ),

  copySiteStatusUpdate: (args: CopySiteStatusUpdateArgs) =>
    baseApi.post<SiteStatusUpdatesResponse>(
      `projects/notifications/${encodeURIComponent(args.notification_id)}/site-status-updates/${encodeURIComponent(args.site_status_update_id)}/copy`,
    ),

  getNotes: (notificationId: string) =>
    baseApi.get<ProjectNotificationNotesResponse>(
      `projects/notifications/${encodeURIComponent(notificationId)}/notes`,
    ),

  addNote: (notificationId: string, args: CreateProjectNotificationNoteArgs) =>
    baseApi.post<ProjectNotificationNoteSingleResponse>(
      `projects/notifications/${encodeURIComponent(notificationId)}/notes`,
      args,
    ),

  getCharts: (args: ProjectNotificationsChartsArgs) =>
    baseApi.get<NotificationChartsResponse>(
      "projects/notifications/charts",
      { params: args },
    ),

  notifySiteStatusUpdateByVoice: (id: string) =>
    baseApi.post<ProjectNotificationSingleResponse>(
      `projects/notifications/${encodeURIComponent(id)}/notify-site-status-update-by-voice`,
    ),

  reassign: (id: string, args: ProjectNotificationReassignArgs) =>
    baseApi.post<ProjectNotificationSingleResponse>(
      `projects/notifications/${encodeURIComponent(id)}/reassign`,
      args,
    ),
};
