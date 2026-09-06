import type { UpdateProjectNotificationArgs } from "@/services/api/projects/notifications/types/args";
import type { WizardFormData } from "./types";
import {
  buildCreateNotificationArgs,
  buildUpdateNotificationArgs,
  type NotificationScope,
} from "@/modules/projects/project/utils/notificationScope";

function sharedLocationAndAssignmentFields(data: WizardFormData) {
  return {
    task_latitude: data.task_latitude ?? 0,
    task_longitude: data.task_longitude ?? 0,
    location_radius: data.location_radius,
    location_link: data.location_link || null,
    repair_point: data.repair_point,
    assigned_user_ids: data.assigned_user_ids,
    selected_distance_meters: data.selected_distance_meters,
    independent_progress: data.independent_progress,
  };
}

function electricityNotificationFields(data: WizardFormData) {
  return {
    notification_number: data.notification_number || null,
    notification_type: data.notification_type,
    work_description: data.work_description || null,
    task_date: data.task_date || null,
    duration_hours: data.duration_hours || null,
    notes: data.notes || null,
    site_status_type_id: data.site_status_type_id || null,
    site_status_type_values: Object.entries(data.site_status_values).map(
      ([key_id, value]) => ({
        key_id,
        value:
          value === "" || value === undefined || value === null
            ? null
            : String(value),
      }),
    ),

    contractor_id: data.contractor_id || null,
    contractor_name: data.contractor_name || null,
    contractor_representative_id: data.contractor_representative_id || null,
    contractor_category: data.contractor_category || null,
    contractor_notes: data.contractor_notes || null,

    ...sharedLocationAndAssignmentFields(data),
  };
}

function waterNotificationFields(data: WizardFormData) {
  return {
    notification_number: data.notification_number || null,
    notification_type: data.notification_type,
    update_site_status_id: data.update_site_status_id || null,
    work_description: data.work_description || null,
    task_date: data.task_date || null,
    task_time: data.task_time || null,
    duration_hours: data.duration_hours || null,

    contractor_id: data.contractor_id || null,
    contractor_name: data.contractor_name || null,
    contractor_number: data.contractor_number || null,
    contractor_technician_id: data.contractor_technician_id || null,
    contractor_technician_number: data.contractor_technician_number || null,
    pole_number: data.pole_number || null,

    ...sharedLocationAndAssignmentFields(data),
  };
}

function wizardDataToNotificationFields(
  data: WizardFormData,
  type?: string,
) {
  if (type === "water") {
    return waterNotificationFields(data);
  }
  return electricityNotificationFields(data);
}

export function buildCreatePayload(
  scope: NotificationScope,
  data: WizardFormData,
  {
    isDraft = false,
    type,
  }: { isDraft?: boolean; type?: string } = {},
) {
  return buildCreateNotificationArgs(scope, {
    ...wizardDataToNotificationFields(data, type),
    is_draft: isDraft,
    ...(type ? { type } : {}),
  });
}

export function buildUpdatePayload(
  id: string,
  scope: NotificationScope,
  data: WizardFormData,
  {
    isDraft = false,
    type,
  }: { isDraft?: boolean; type?: string } = {},
): UpdateProjectNotificationArgs {
  return buildUpdateNotificationArgs(scope, {
    id,
    ...wizardDataToNotificationFields(data, type),
    is_draft: isDraft,
    ...(type ? { type } : {}),
  });
}
