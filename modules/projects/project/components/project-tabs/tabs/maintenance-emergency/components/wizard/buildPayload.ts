import type {
  CreateProjectNotificationArgs,
  UpdateProjectNotificationArgs,
} from "@/services/api/projects/notifications/types/args";
import type { WizardFormData } from "./types";

export function buildCreatePayload(
  projectId: string,
  data: WizardFormData,
): CreateProjectNotificationArgs {
  return {
    project_id: projectId,
    notification_number: data.notification_number || null,
    notification_type: data.notification_type,
    feeder_number: data.feeder_number || null,
    work_description: data.work_description || null,
    task_date: data.task_date || null,
    duration_hours: data.duration_hours || null,
    notes: data.notes || null,

    contractor_id: data.contractor_id || null,
    contractor_name: data.contractor_name || null,
    contractor_number: data.contractor_number || null,
    contractor_technical_name: data.contractor_technical_name || null,
    contractor_technical_number: data.contractor_technical_number || null,
    contractor_notes: data.contractor_notes || null,

    task_latitude: data.task_latitude ?? 0,
    task_longitude: data.task_longitude ?? 0,
    location_radius: data.location_radius,
    location_link: data.location_link || null,
    repair_point: data.repair_point,

    assigned_user_id: data.assigned_user_id,
    selected_distance_meters: data.selected_distance_meters,
  };
}

export function buildUpdatePayload(
  id: string,
  projectId: string,
  data: WizardFormData,
): UpdateProjectNotificationArgs {
  return {
    id,
    project_id: projectId,
    notification_number: data.notification_number || null,
    notification_type: data.notification_type,
    feeder_number: data.feeder_number || null,
    work_description: data.work_description || null,
    task_date: data.task_date || null,
    duration_hours: data.duration_hours || null,
    notes: data.notes || null,

    contractor_id: data.contractor_id || null,
    contractor_name: data.contractor_name || null,
    contractor_number: data.contractor_number || null,
    contractor_technical_name: data.contractor_technical_name || null,
    contractor_technical_number: data.contractor_technical_number || null,
    contractor_notes: data.contractor_notes || null,

    task_latitude: data.task_latitude ?? 0,
    task_longitude: data.task_longitude ?? 0,
    location_radius: data.location_radius,
    location_link: data.location_link || null,
    repair_point: data.repair_point,

    assigned_user_id: data.assigned_user_id,
    selected_distance_meters: data.selected_distance_meters,
  };
}
