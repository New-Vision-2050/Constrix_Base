import { baseApi } from "@/config/axios/instances/base";
import type {
  CreateProjectNotificationArgs,
  ProjectNotificationsChartsArgs,
  ProjectNotificationsEmployeesLocationsArgs,
  ProjectNotificationsExportArgs,
  ProjectNotificationsListArgs,
  ProjectNotificationsMapTasksArgs,
  ProjectNotificationsMobileListArgs,
  ProjectNotificationMobileActionArgs,
  ProjectNotificationRejectArgs,
  UpdateProjectNotificationArgs,
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
  ProjectNotificationSingleResponse,
  ProjectNotificationTypesResponse,
  ProjectNotificationsListResponse,
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

  getById: (id: string) =>
    baseApi.get<ProjectNotificationSingleResponse>(
      `projects/notifications/${encodeURIComponent(id)}`,
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

  endTask: (id: string, args: ProjectNotificationMobileActionArgs) =>
    baseApi.post<ProjectNotificationSingleResponse>(
      `projects/notifications/${encodeURIComponent(id)}/end`,
      args,
    ),

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

  getSiteStatusUpdates: (notificationId: string) =>
    baseApi.get<SiteStatusUpdatesResponse>(
      `projects/notifications/${encodeURIComponent(notificationId)}/site-status-updates`,
    ),

  getCharts: (args: ProjectNotificationsChartsArgs) =>
    baseApi.get<NotificationChartsResponse>(
      "projects/notifications/charts",
      { params: args },
    ),
};
