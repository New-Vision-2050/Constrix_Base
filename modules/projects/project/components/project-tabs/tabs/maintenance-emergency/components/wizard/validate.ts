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
    if (!data.severity?.trim()) {
      errors.severity = "required";
    }
    if (!data.magdy_number?.trim()) {
      errors.magdy_number = "required";
    }
    if (!data.work_type?.trim()) {
      errors.work_type = "required";
    }
    if (!data.work_description?.trim()) {
      errors.work_description = "required";
    } else if (data.work_description.trim().length < 10) {
      errors.work_description = "minLength";
    }
  }

  if (step === 2) {
    if (!data.contractor_name?.trim()) {
      errors.contractor_name = "required";
    }
    if (data.contractor_mobile?.trim()) {
      const saMobile = /^05\d{8}$/;
      if (!saMobile.test(data.contractor_mobile.trim())) {
        errors.contractor_mobile = "invalidMobile";
      }
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
    if (!data.repair_point?.trim()) {
      errors.repair_point = "required";
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
    1: ["notification_type", "severity", "magdy_number", "work_type", "work_description"],
    2: ["contractor_name", "contractor_mobile"],
    3: ["task_latitude", "task_longitude", "location_radius", "repair_point"],
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
