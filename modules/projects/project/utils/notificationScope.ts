import type {
  CreateProjectNotificationArgs,
  ProjectNotificationsEmployeesLocationsArgs,
  ProjectNotificationsExportArgs,
  ProjectNotificationsListArgs,
  ProjectNotificationsMapTasksArgs,
  UpdateProjectNotificationArgs,
} from "@/services/api/projects/notifications/types/args";

export interface NotificationScope {
  projectId?: string;
  contractualEngagementKey?: string;
}

export function hasNotificationScope(scope: NotificationScope): boolean {
  return !!(scope.projectId || scope.contractualEngagementKey);
}

export function buildNotificationScopeParams(
  scope: NotificationScope,
):
  | { project_id: string }
  | { contractual_engagement_key: string } {
  if (scope.contractualEngagementKey) {
    return { contractual_engagement_key: scope.contractualEngagementKey };
  }
  return { project_id: scope.projectId! };
}

export function buildNotificationsListArgs(
  scope: NotificationScope,
  params: Omit<
    ProjectNotificationsListArgs,
    "project_id" | "contractual_engagement_key"
  >,
): ProjectNotificationsListArgs {
  return {
    ...buildNotificationScopeParams(scope),
    ...params,
  } as ProjectNotificationsListArgs;
}

export function buildNotificationsExportArgs(
  scope: NotificationScope,
  params: Omit<
    ProjectNotificationsExportArgs,
    "project_id" | "contractual_engagement_key"
  >,
): ProjectNotificationsExportArgs {
  return {
    ...buildNotificationScopeParams(scope),
    ...params,
  } as ProjectNotificationsExportArgs;
}

export function buildNotificationsMapTasksArgs(
  scope: NotificationScope,
  status?: string,
): ProjectNotificationsMapTasksArgs {
  return {
    ...buildNotificationScopeParams(scope),
    ...(status ? { status } : {}),
  } as ProjectNotificationsMapTasksArgs;
}

export function buildNotificationsEmployeesLocationsArgs(
  scope: NotificationScope,
  latitude: number,
  longitude: number,
): ProjectNotificationsEmployeesLocationsArgs {
  return {
    ...buildNotificationScopeParams(scope),
    latitude,
    longitude,
  } as ProjectNotificationsEmployeesLocationsArgs;
}

export function buildCreateNotificationArgs(
  scope: NotificationScope,
  data: Omit<
    CreateProjectNotificationArgs,
    "project_id" | "contractual_engagement_key"
  >,
): CreateProjectNotificationArgs {
  return {
    ...buildNotificationScopeParams(scope),
    ...data,
  } as CreateProjectNotificationArgs;
}

export function buildUpdateNotificationArgs(
  scope: NotificationScope,
  data: Omit<
    UpdateProjectNotificationArgs,
    "project_id" | "contractual_engagement_key"
  >,
): UpdateProjectNotificationArgs {
  return {
    ...buildNotificationScopeParams(scope),
    ...data,
  } as UpdateProjectNotificationArgs;
}

export function notificationScopeExportFilename(scope: NotificationScope): string {
  return `notifications-${scope.contractualEngagementKey ?? scope.projectId}.xlsx`;
}
