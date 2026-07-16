import type { UpdateProjectNotificationArgs } from "@/services/api/projects/notifications/types/args";
import type { WizardFormData } from "./types";
import {
  buildCreateNotificationArgs,
  buildUpdateNotificationArgs,
  type NotificationScope,
} from "@/modules/projects/project/utils/notificationScope";

function wizardDataToNotificationFields(data: WizardFormData) {
  return {
    notification_number: data.notification_number || null,
    notification_type: data.notification_type,
    feeder_number: data.feeder_number || null,
    machine_number: data.machine_number || null,
    work_description: data.work_description || null,
    task_date: data.task_date || null,
    duration_hours: data.duration_hours || null,
    notes: data.notes || null,
    site_status_type_id: data.site_status_type_id || null,
    site_status_type_values: Object.entries(data.site_status_values)
      .filter(([, v]) => v !== "" && v !== undefined && v !== null)
      .map(([key_id, value]) => ({ key_id, value: String(value) })),

    contractor_id: data.contractor_id || null,
    contractor_name: data.contractor_name || null,
    contractor_technical_name: data.contractor_technical_name || null,
    contractor_technical_number: data.contractor_technical_number || null,
    contractor_category: data.contractor_category || null,
    contractor_notes: data.contractor_notes || null,
    permit_source: data.permit_source || null,
    permit_recipient: data.permit_recipient || null,

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

export function buildCreatePayload(
  scope: NotificationScope,
  data: WizardFormData,
  { isDraft = false }: { isDraft?: boolean } = {},
) {
  return buildCreateNotificationArgs(scope, {
    ...wizardDataToNotificationFields(data),
    is_draft: isDraft,
  });
}

export function buildUpdatePayload(
  id: string,
  scope: NotificationScope,
  data: WizardFormData,
  { isDraft = false }: { isDraft?: boolean } = {},
): UpdateProjectNotificationArgs {
  return buildUpdateNotificationArgs(scope, {
    id,
    ...wizardDataToNotificationFields(data),
    is_draft: isDraft,
  });
}
