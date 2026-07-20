import type { ProjectNotification } from "@/services/api/projects/notifications/types/response";
import type { WizardFormData } from "./types";

export function notificationToWizardForm(
  notification: ProjectNotification | null | undefined,
): WizardFormData {
  if (!notification) {
    return {
      notification_number: "",
      notification_type: "",
      feeder_number: "",
      machine_number: "",
      work_description: "",
      task_date: new Date().toISOString().split("T")[0],
      duration_hours: 4,
      notes: "",
      site_status_type_id: "",
      site_status_values: {},
      contractor_id: "",
      contractor_name: "",
      contractor_representative_id: "",
      contractor_category: "",
      contractor_notes: "",
      permit_source: "",
      permit_recipient: "",
      task_latitude: null,
      task_longitude: null,
      location_radius: 250,
      location_link: "",
      repair_point: "",
      assigned_user_ids: [],
      selected_distance_meters: 0,
      independent_progress: true,
      employees: [],
    };
  }

  return {
    notification_number: notification.notification_number ?? "",
    notification_type: notification.notification_type ?? "",
    feeder_number: notification.feeder_number ?? "",
    machine_number: notification.machine_number ?? "",
    work_description: notification.work_description ?? "",
    task_date: notification.task_date ?? new Date().toISOString().split("T")[0],
    duration_hours: notification.duration_hours ?? 4,
    notes: notification.notes ?? "",
    site_status_type_id: notification.site_status_type_id ?? "",
    site_status_values: Object.fromEntries(
      (notification.site_status_values ?? []).map((v) => [v.key_id, v.value]),
    ),

    contractor_id: notification.contractor_id ?? "",
    contractor_name: notification.contractor_name ?? "",
    contractor_representative_id: notification.contractor_representative_id ?? "",
    contractor_category: notification.contractor_category ?? "",
    contractor_notes: notification.contractor_notes ?? "",
    permit_source: notification.permit_source ?? "",
    permit_recipient: notification.permit_recipient ?? "",

    task_latitude: notification.task_latitude ?? null,
    task_longitude: notification.task_longitude ?? null,
    location_radius: notification.location_radius ?? 250,
    location_link: notification.location_link ?? "",
    repair_point: notification.repair_point ?? "",

    assigned_user_ids: notification.assigned_user_ids ?? [],
    selected_distance_meters: notification.selected_distance_meters ?? 0,
    independent_progress: notification.independent_progress ?? true,
    employees: [],
  };
}
