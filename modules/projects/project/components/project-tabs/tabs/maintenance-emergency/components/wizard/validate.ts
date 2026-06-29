import type { WizardFormData, WizardFormErrors } from "./types";

export function validateStep(
  step: 1 | 2 | 3 | 4 | 5,
  data: WizardFormData,
): { valid: boolean; errors: WizardFormErrors } {
  const errors: WizardFormErrors = {};

  if (step === 1) {
    if (!data.notification_type?.trim()) {
      errors.notification_type = "required";
    }
  }

  if (step === 2) {
    if (!data.contractor_name?.trim()) {
      errors.contractor_name = "required";
    }
  }

  if (step === 3) {
    if (data.task_latitude == null || data.task_longitude == null) {
      errors.task_latitude = "required";
    } else {
      if (data.task_latitude < -90 || data.task_latitude > 90) {
        errors.task_latitude = "invalid";
      }
      if (data.task_longitude < -180 || data.task_longitude > 180) {
        errors.task_longitude = "invalid";
      }
    }
    if (!data.location_radius || data.location_radius <= 0) {
      errors.location_radius = "required";
    }
  }

  if (step === 4) {
    if (!data.assigned_user_id?.trim()) {
      errors.assigned_user_id = "required";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function firstStepWithError(errors: WizardFormErrors): 1 | 2 | 3 | 4 | 5 | null {
  const stepFields: Record<1 | 2 | 3 | 4 | 5, string[]> = {
    1: ["notification_type"],
    2: ["contractor_name"],
    3: ["task_latitude", "task_longitude", "location_radius"],
    4: ["assigned_user_id"],
    5: [],
  };

  for (let step = 1; step <= 5; step++) {
    if (stepFields[step as 1 | 2 | 3 | 4 | 5].some((field) => errors[field])) {
      return step as 1 | 2 | 3 | 4 | 5;
    }
  }
  return null;
}
