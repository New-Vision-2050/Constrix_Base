import { baseApi } from "@/config/axios/instances/base";
import type {
  CreateProjectNotificationArgs,
  ProjectNotificationsEmployeesLocationsArgs,
  ProjectNotificationsExportArgs,
  ProjectNotificationsListArgs,
  ProjectNotificationsMobileListArgs,
  ProjectNotificationMobileActionArgs,
  ProjectNotificationRejectArgs,
  UpdateProjectNotificationArgs,
} from "./types/args";
import type {
  ProjectNotificationAvailableActionsResponse,
  ProjectNotificationContractorsResponse,
  ProjectNotificationDeleteResponse,
  ProjectNotificationEmployeesLocationsResponse,
  ProjectNotificationFiltersResponse,
  ProjectNotificationMyInboxCountsResponse,
  ProjectNotificationMyInboxResponse,
  ProjectNotificationMyTasksResponse,
  ProjectNotificationSingleResponse,
  ProjectNotificationsListResponse,
} from "./types/response";

export type {
  ProjectNotification,
  ProjectNotificationContractor,
  ProjectNotificationEmployee,
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

  update: (id: string, args: UpdateProjectNotificationArgs) =>
    baseApi.put<ProjectNotificationSingleResponse>(
      `projects/notifications/${encodeURIComponent(id)}`,
      args,
    ),

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
};
