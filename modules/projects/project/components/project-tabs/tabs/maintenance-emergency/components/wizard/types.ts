import type { ProjectNotificationEmployee } from "@/services/api/projects/notifications/types/response";

export type WizardStep = 1 | 2 | 3 | 4 | 5;

export interface WizardFormData {
  // Step 1
  notification_number: string;
  notification_type: string;
  feeder_number: string;
  machine_number: string;
  work_description: string;
  task_date: string;
  duration_hours: number;
  notes: string;

  // Step 2
  contractor_id: string;
  contractor_name: string;
  contractor_technical_name: string;
  contractor_technical_number: string;
  contractor_category: string;
  contractor_notes: string;
  permit_source: string;
  permit_recipient: string;

  // Step 3
  task_latitude: number | null;
  task_longitude: number | null;
  location_radius: number;
  location_link: string;
  repair_point: string;

  // Step 4
  assigned_user_id: string;
  selected_distance_meters: number;
  employees: ProjectNotificationEmployee[];
}

export interface WizardFormErrors {
  [key: string]: string | undefined;
}

export const EMPTY_FORM: WizardFormData = {
  notification_number: "",
  notification_type: "",
  feeder_number: "",
  machine_number: "",
  work_description: "",
  task_date: new Date().toISOString().split("T")[0],
  duration_hours: 4,
  notes: "",

  contractor_id: "",
  contractor_name: "",
  contractor_technical_name: "",
  contractor_technical_number: "",
  contractor_category: "",
  contractor_notes: "",
  permit_source: "",
  permit_recipient: "",

  task_latitude: null,
  task_longitude: null,
  location_radius: 250,
  location_link: "",
  repair_point: "",

  assigned_user_id: "",
  selected_distance_meters: 0,
  employees: [],
};
