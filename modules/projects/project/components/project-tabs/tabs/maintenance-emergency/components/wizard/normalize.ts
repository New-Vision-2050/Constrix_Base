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
      work_description: "",
      task_date: new Date().toISOString().split("T")[0],
      duration_hours: 4,
      notes: "",
      contractor_id: "",
      contractor_name: "",
      contractor_number: "",
      contractor_technical_name: "",
      contractor_technical_number: "",
      contractor_category: "",
      contractor_notes: "",
      contractor_mobile: "",
      task_latitude: null,
      task_longitude: null,
      location_radius: 250,
      location_link: "",
      repair_point: "",
      assigned_user_id: "",
      selected_distance_meters: 0,
      employees: [],
    };
  }

  return {
    notification_number: notification.notification_number ?? "",
    notification_type: notification.notification_type ?? "",
    feeder_number: notification.feeder_number ?? "",
    work_description: notification.work_description ?? "",
    task_date: notification.task_date ?? new Date().toISOString().split("T")[0],
    duration_hours: notification.duration_hours ?? 4,
    notes: notification.notes ?? "",

    contractor_id: notification.contractor_id ?? "",
    contractor_name: notification.contractor_name ?? "",
    contractor_number: notification.contractor_number ?? "",
    contractor_technical_name: notification.contractor_technical_name ?? "",
    contractor_technical_number: notification.contractor_technical_number ?? "",
    contractor_category: notification.contractor_category ?? "",
    contractor_notes: notification.contractor_notes ?? "",
    contractor_mobile: notification.contractor_mobile ?? "",

    task_latitude: notification.task_latitude ?? null,
    task_longitude: notification.task_longitude ?? null,
    location_radius: notification.location_radius ?? 250,
    location_link: notification.location_link ?? "",
    repair_point: notification.repair_point ?? "",

    assigned_user_id: notification.assigned_user_id ?? "",
    selected_distance_meters: notification.selected_distance_meters ?? 0,
    employees: [],
  };
}
