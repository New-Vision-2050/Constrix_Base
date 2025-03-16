"use client";
import { useState, useCallback, useEffect } from "react";
import { FormConfig } from "../types/formTypes";
import { defaultSubmitHandler } from "../utils/defaultSubmitHandler";
import { defaultStepSubmitHandler } from "../utils/defaultStepSubmitHandler";
import { useFormStore } from "./useFormStore";

interface UseSheetFormProps {
  config: FormConfig;
  onSuccess?: (values: Record<string, any>) => void;
  onCancel?: () => void;
}

interface UseSheetFormResult {
  isOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: string | null;
  setValues: (values: Record<string, any>) => void;
  setValue: (field: string, value: any) => void;
  setTouched: (field: string, isTouched: boolean) => void;
  setAllTouched: () => void;
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleCancel: () => void;
  // Wizard/Accordion related properties and methods
  isWizard: boolean;
  isAccordion: boolean;
  isStepBased: boolean;
  currentStep: number;
  totalSteps: number;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  goToStep: (step: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  validateCurrentStep: () => boolean;
  // Step submission related properties and methods
  submitCurrentStep: () => Promise<boolean>;
  isSubmittingStep: boolean;
  stepResponses: Record<
    number,
    { success: boolean; message?: string; data?: Record<string, any> }
  >;
  getStepResponseData: (step: number, key?: string) => any;
  // Error handling
  clearFiledError: (fieldName: string) => void;
}

export function useSheetForm({
  config,
  onSuccess,
  onCancel,
}: UseSheetFormProps): UseSheetFormResult {
  // Sheet state
  const [isOpen, setIsOpen] = useState(false);

  // Form state
  const [values, setValues] = useState<Record<string, any>>(
    config.initialValues || {}
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Wizard/Accordion state
  const isWizard = config.wizard || false;
  const isAccordion = config.accordion || false;
  const isStepBased = isWizard || isAccordion;
  const totalSteps = isStepBased ? config.sections.length : 1;
  const [currentStep, setCurrentStep] = useState(0);
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  // Step submission state
  const [isSubmittingStep, setIsSubmittingStep] = useState(false);
  const [stepResponses, setStepResponses] = useState<
    Record<
      number,
      {
        success: boolean;
        message?: string;
        data?: Record<string, any>;
      }
    >
  >({});

  // Reset form when config changes
  useEffect(() => {
    if (config.initialValues) {
      setValues(config.initialValues);
    }
  }, [config]);

  // Open and close sheet
  const openSheet = useCallback(() => {
    setIsOpen(true);
    // Reset to first step when opening the sheet in step-based mode
    if (isStepBased) {
      setCurrentStep(0);
    }
  }, [isStepBased]);

  const closeSheet = useCallback(() => {
    setIsOpen(false);
    // Reset form state when sheet is closed
    if (config.resetOnSuccess) {
      resetForm();
    }
    // Always reset to first step when closing the sheet in step-based mode
    if (isStepBased) {
      setCurrentStep(0);
    }
  }, [config.resetOnSuccess, isStepBased]);

  // Form actions
  const setValue = useCallback((field: string, value: any) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const setFieldTouched = useCallback((field: string, isTouched: boolean) => {
    setTouched((prev) => ({
      ...prev,
      [field]: isTouched,
    }));
  }, []);

  const setAllTouched = useCallback(() => {
    const allTouched: Record<string, boolean> = {};

    // Mark all fields as touched
    config.sections.forEach((section) => {
      section.fields.forEach((field) => {
        allTouched[field.name] = true;
      });
    });

    setTouched(allTouched);
  }, [config.sections]);

  const resetForm = useCallback(() => {
    setValues(config.initialValues || {});
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitSuccess(false);
    setSubmitError(null);
  }, [config.initialValues]);

  // Validate all form fields
  const validateAllFields = useCallback(() => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Get existing errors from API validation
    const formStoreErrors = useFormStore.getState().errors;

    // Iterate through all sections and fields
    config.sections.forEach((section) => {
      // Skip sections that don't meet their condition
      if (section.condition && !section.condition(values)) {
        return;
      }

      section.fields.forEach((field) => {
        // Skip fields that don't meet their condition
        if (field.condition && !field.condition(values)) {
          return;
        }

        // Skip fields that are hidden or disabled
        if (field.hidden || field.disabled) {
          return;
        }

        // Check if there's an API validation error for this field
        if (formStoreErrors[field.name]) {
          newErrors[field.name] = formStoreErrors[field.name];
          isValid = false;
          return; // Skip other validations for this field
        }

        // Check required fields
        if (
          field.required &&
          (!values[field.name] || values[field.name] === "")
        ) {
          newErrors[field.name] = `${field.label} is required`;
          isValid = false;
        }

        // Check validation rules
        if (field.validation && field.validation.length > 0) {
          for (const rule of field.validation) {
            const value = values[field.name];

            switch (rule.type) {
              case "required":
                if (value === undefined || value === null || value === "") {
                  newErrors[field.name] = rule.message;
                  isValid = false;
                }
                break;
              case "minLength":
                if (typeof value === "string" && value.length < rule.value) {
                  newErrors[field.name] = rule.message;
                  isValid = false;
                }
                break;
              case "maxLength":
                if (typeof value === "string" && value.length > rule.value) {
                  newErrors[field.name] = rule.message;
                  isValid = false;
                }
                break;
              case "pattern":
                if (
                  typeof value === "string" &&
                  !new RegExp(rule.value).test(value)
                ) {
                  newErrors[field.name] = rule.message;
                  isValid = false;
                }
                break;
              case "email":
                if (
                  typeof value === "string" &&
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
                ) {
                  newErrors[field.name] = rule.message;
                  isValid = false;
                }
                break;
              // Add other validation types as needed
            }

            // Break the loop if we already found an error for this field
            if (newErrors[field.name]) {
              break;
            }
          }
        }
      });
    });

    // Update form state with errors
    setErrors(newErrors);

    return isValid;
  }, [config.sections, values]);

  const clearFiledError = (fieldName: string) => {
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[fieldName];
      return updatedErrors;
    });
  };

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation(); // Stop event propagation to prevent rerendering

      // Reset submission state
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      // Mark all fields as touched
      setAllTouched();

      // Validate all fields before submission
      const isValid = validateAllFields();

      // Check if any fields are currently being validated via API
      const hasValidatingFields = useFormStore.getState().hasValidatingFields();

      // If form is not valid or fields are being validated, stop submission
      if (!isValid || hasValidatingFields) {
        if (hasValidatingFields) {
          setSubmitError("Please wait for field validation to complete");
        }
        setIsSubmitting(false);
        return;
      }

      try {
        // For step-based forms, include step response data in the form values
        let finalValues = { ...values };

        if (isStepBased) {
          console.log(
            "Submitting step-based form with step responses:",
            stepResponses
          );

          // Include data from step responses in the final values
          Object.entries(stepResponses).forEach(([stepIndex, response]) => {
            if (response.data) {
              // Add a prefix to avoid name collisions
              const stepPrefix = `step_${stepIndex}_`;
              Object.entries(response.data).forEach(([key, value]) => {
                // Skip if the key already exists in values
                if (!(key in finalValues)) {
                  finalValues[`${key}`] = value;
                }
              });

              // Also include IDs directly if they exist
              if (response.data.companyId) {
                finalValues.companyId = response.data.companyId;
              }
              if (response.data.userId) {
                finalValues.userId = response.data.userId;
              }
            }
          });

          console.log("Final values for submission:", finalValues);
        }

        // Call the onSubmit handler from config or use default handler
        const submitHandler =
          config.onSubmit || ((values) => defaultSubmitHandler(values, config));
        const result = await submitHandler(finalValues);
        if (result.success) {
          setSubmitSuccess(true);

          // Call onSuccess callback from props if provided
          if (onSuccess) {
            onSuccess({ values, result });
          }

          // Call onSuccess callback from config if provided
          if (config.onSuccess) {
            config.onSuccess(values, {
              success: true,
              message: result.message,
            });
          }

          // Close the sheet after successful submission
          setTimeout(() => {
            closeSheet();
          }, 1000);

          // Reset form if configured to do so
          if (config.resetOnSuccess) {
            resetForm();
          }
        } else {
          // Handle API error message
          setSubmitError(result.message || "Form submission failed");

          // Call onError callback from config if provided
          if (config.onError) {
            config.onError(values, {
              message: result.message,
              errors: result.errors,
            });
          }

          // Handle Laravel validation errors if enabled
          if (config.laravelValidation?.enabled && result.errors) {
            const formattedErrors: Record<string, string> = {};

            // Convert Laravel validation errors to form errors
            Object.entries(result.errors).forEach(([field, messages]) => {
              formattedErrors[field] = Array.isArray(messages)
                ? messages[0]
                : messages;
            });

            // Set form errors
            setErrors(formattedErrors);

            // Mark fields with errors as touched
            Object.keys(formattedErrors).forEach((field) => {
              setFieldTouched(field, true);
            });

            // Call onValidationError callback if provided
            if (config.onValidationError) {
              config.onValidationError(formattedErrors);
            }
          }
        }
      } catch (error) {
        console.log("Form submission error:", error);
        setSubmitError("An unexpected error occurred");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      config,
      values,
      validateAllFields,
      setAllTouched,
      closeSheet,
      resetForm,
      onSuccess,
      setFieldTouched,
      config.onSuccess,
      config.onError,
      config.onValidationError,
      isStepBased,
      stepResponses,
    ]
  );

  // Validate only the fields in the current step
  const validateCurrentStep = useCallback(() => {
    if (!isStepBased) return true; // If not in step-based mode (wizard or accordion), return true

    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Get existing errors from API validation
    const formStoreErrors = useFormStore.getState().errors;

    // Get the current section
    const currentSection = config.sections[currentStep];

    // Skip section if it doesn't meet its condition
    if (currentSection.condition && !currentSection.condition(values)) {
      return true;
    }

    // Validate fields in the current section
    currentSection.fields.forEach((field) => {
      // Skip fields that don't meet their condition
      if (field.condition && !field.condition(values)) {
        return;
      }

      // Skip fields that are hidden or disabled
      if (field.hidden || field.disabled) {
        return;
      }

      // Check if there's an API validation error for this field
      if (formStoreErrors[field.name]) {
        newErrors[field.name] = formStoreErrors[field.name];
        isValid = false;
        return; // Skip other validations for this field
      }

      // Check required fields
      if (
        field.required &&
        (!values[field.name] || values[field.name] === "")
      ) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      }

      // Check validation rules
      if (field.validation && field.validation.length > 0) {
        for (const rule of field.validation) {
          const value = values[field.name];

          switch (rule.type) {
            case "required":
              if (value === undefined || value === null || value === "") {
                newErrors[field.name] = rule.message;
                isValid = false;
              }
              break;
            case "minLength":
              if (typeof value === "string" && value.length < rule.value) {
                newErrors[field.name] = rule.message;
                isValid = false;
              }
              break;
            case "maxLength":
              if (typeof value === "string" && value.length > rule.value) {
                newErrors[field.name] = rule.message;
                isValid = false;
              }
              break;
            case "pattern":
              if (
                typeof value === "string" &&
                !new RegExp(rule.value).test(value)
              ) {
                newErrors[field.name] = rule.message;
                isValid = false;
              }
              break;
            case "email":
              if (
                typeof value === "string" &&
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
              ) {
                newErrors[field.name] = rule.message;
                isValid = false;
              }
              break;
            // Add other validation types as needed
          }

          // Break the loop if we already found an error for this field
          if (newErrors[field.name]) {
            break;
          }
        }
      }
    });

    // Update form state with errors
    setErrors(newErrors);

    return isValid;
  }, [config.sections, currentStep, isStepBased, values]);

  // Wizard navigation functions
  const goToNextStep = useCallback(() => {
    // If validation is required before proceeding
    if (
      config.wizardOptions?.validateStepBeforeNext &&
      !validateCurrentStep()
    ) {
      // Mark all fields in the current step as touched
      const currentStepTouched: Record<string, boolean> = { ...touched };
      config.sections[currentStep].fields.forEach((field) => {
        currentStepTouched[field.name] = true;
      });
      setTouched(currentStepTouched);
      return;
    }

    // Don't go beyond the last step
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;

      // Call onStepChange callback if provided
      if (config.wizardOptions?.onStepChange) {
        config.wizardOptions.onStepChange(currentStep, nextStep, values);
      }

      setCurrentStep(nextStep);
    }
  }, [
    config.wizardOptions,
    currentStep,
    totalSteps,
    validateCurrentStep,
    values,
    touched,
    config.sections,
  ]);

  const goToPrevStep = useCallback(() => {
    // Don't go before the first step
    if (currentStep > 0) {
      const prevStep = currentStep - 1;

      // Call onStepChange callback if provided
      if (config.wizardOptions?.onStepChange) {
        config.wizardOptions.onStepChange(currentStep, prevStep, values);
      }

      setCurrentStep(prevStep);
    }
  }, [config.wizardOptions, currentStep, values]);

  const goToStep = useCallback(
    (step: number) => {
      // Ensure step is within bounds
      if (step >= 0 && step < totalSteps) {
        // If direct navigation is not allowed, only allow going to previous steps
        if (!config.wizardOptions?.allowStepNavigation && step > currentStep) {
          return;
        }

        // Call onStepChange callback if provided
        if (config.wizardOptions?.onStepChange) {
          config.wizardOptions.onStepChange(currentStep, step, values);
        }

        setCurrentStep(step);
      }
    },
    [config.wizardOptions, currentStep, totalSteps, values]
  );

  // Submit the current step
  const submitCurrentStep = useCallback(async (): Promise<boolean> => {
    // If not in step-based mode (wizard or accordion), return true
    if (!isStepBased) {
      return true;
    }

    // Validate the current step
    if (!validateCurrentStep()) {
      // Mark all fields in the current step as touched
      const currentStepTouched: Record<string, boolean> = { ...touched };
      config.sections[currentStep].fields.forEach((field) => {
        currentStepTouched[field.name] = true;
      });
      setTouched(currentStepTouched);
      return false;
    }

    // Check if any fields are currently being validated via API
    const hasValidatingFields = useFormStore.getState().hasValidatingFields();
    if (hasValidatingFields) {
      setSubmitError("Please wait for field validation to complete");
      return false;
    }

    try {
      setIsSubmittingStep(true);

      // Call the onStepSubmit handler or use the default handler
      const submitHandler =
        config.wizardOptions?.onStepSubmit ||
        ((step, values) => defaultStepSubmitHandler(step, values, config));

      const result = await submitHandler(currentStep, values);

      // Store the response
      setStepResponses((prev) => ({
        ...prev,
        [currentStep]: {
          success: result.success,
          message: result.message,
          data: result.data,
        },
      }));

      // Handle validation errors if any
      if (!result.success && result.errors) {
        const formattedErrors: Record<string, string> = {};

        // Convert validation errors to form errors
        Object.entries(result.errors).forEach(([field, messages]) => {
          formattedErrors[field] = Array.isArray(messages)
            ? messages[0]
            : messages;
        });

        // Set form errors
        setErrors(formattedErrors);

        // Mark fields with errors as touched
        Object.keys(formattedErrors).forEach((field) => {
          setFieldTouched(field, true);
        });

        // Call onValidationError callback if provided
        if (config.onValidationError) {
          config.onValidationError(formattedErrors);
        }

        return false;
      }

      return result.success;
    } catch (error) {
      console.log("Step submission error:", error);
      return false;
    } finally {
      setIsSubmittingStep(false);
    }
  }, [
    isStepBased,
    config,
    currentStep,
    values,
    touched,
    validateCurrentStep,
    setFieldTouched,
  ]);

  // Get data from a step response
  const getStepResponseData = useCallback(
    (step: number, key?: string): any => {
      const response = stepResponses[step];
      if (!response || !response.data) {
        return undefined;
      }

      if (key) {
        return response.data[key];
      }

      return response.data;
    },
    [stepResponses]
  );

  // Handle form cancel
  const handleCancel = useCallback(() => {
    closeSheet();

    // Call onCancel callback if provided
    if (onCancel) {
      onCancel();
    } else if (config.onCancel) {
      config.onCancel();
    }
  }, [closeSheet, onCancel, config.onCancel]);

  return {
    isOpen,
    openSheet,
    closeSheet,
    values,
    errors,
    touched,
    isSubmitting,
    submitSuccess,
    submitError,
    setValues,
    setValue,
    setTouched: setFieldTouched,
    setAllTouched,
    resetForm,
    handleSubmit,
    handleCancel,
    // Wizard/Accordion related properties and methods
    isWizard,
    isAccordion,
    isStepBased,
    currentStep,
    totalSteps,
    goToNextStep,
    goToPrevStep,
    goToStep,
    isFirstStep,
    isLastStep,
    validateCurrentStep,
    // Step submission related properties and methods
    submitCurrentStep,
    isSubmittingStep,
    stepResponses,
    getStepResponseData,
    clearFiledError,
  };
}
