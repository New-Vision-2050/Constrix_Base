"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm, useFieldArray, FieldValues, UseFormReturn, SubmitHandler, UseFormProps, FormState, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormConfig, FormSection, FieldConfig } from "../types/formTypes";
import { defaultSubmitHandler } from "../utils/defaultSubmitHandler";
import { defaultStepSubmitHandler } from "../utils/defaultStepSubmitHandler";
import { hasApiValidation, triggerApiValidation } from "../utils/apiValidation";
import { apiClient } from "@/config/axios-config";

// Helper function to create a Zod schema from form config
const createZodSchema = (config: FormConfig): z.ZodTypeAny => {
  const schemaMap: Record<string, any> = {};

  // Process all sections and fields to build the schema
  config.sections.forEach((section) => {
    section.fields.forEach((field) => {
      // Skip fields with conditions or that are hidden
      if (field.hidden) return;

      let fieldSchema: z.ZodTypeAny;

      // Base type based on field type
      switch (field.type) {
        case "text":
        case "textarea":
        case "search":
        case "password":
          fieldSchema = z.string().optional();
          break;
        case "email":
          // For email fields, find if there's a validation rule with type "email" to get the message
          const emailValidationRule = field.validation?.find(rule => rule.type === "email");
          fieldSchema = z.string().email(emailValidationRule?.message as string || "Invalid email").optional();
          break;
        case "number":
          fieldSchema = z.number().optional();
          break;
        case "checkbox":
          fieldSchema = z.boolean().optional();
          break;
        case "date":
          fieldSchema = z.date().optional();
          break;
        case "select":
          fieldSchema = z.any().optional();
          break;
        case "multiSelect":
          fieldSchema = z.array(z.any()).optional();
          break;
        case "phone":
          fieldSchema = z.string().optional();
          break;
        case "hiddenObject":
          fieldSchema = z.record(z.any()).optional();
          break;
        case "dynamicRows":
          fieldSchema = z.array(z.record(z.any())).optional();
          break;
        default:
          fieldSchema = z.any().optional();
      }

      // Apply validation rules
      if (field.validation) {
        field.validation.forEach((rule) => {
          // Use the message directly from the validation rule
          const errorMessage = rule.message as string;

          switch (rule.type) {
            case "required":
              fieldSchema = z.string().min(1, errorMessage);
              break;
            case "minLength":
              if (field.type === "text" || field.type === "textarea" || field.type === "email" || field.type === "password") {
                fieldSchema = (fieldSchema as z.ZodString).min(rule.value, errorMessage);
              }
              break;
            case "maxLength":
              if (field.type === "text" || field.type === "textarea" || field.type === "email" || field.type === "password") {
                fieldSchema = (fieldSchema as z.ZodString).max(rule.value, errorMessage);
              }
              break;
            case "pattern":
              if (field.type === "text" || field.type === "textarea" || field.type === "email" || field.type === "password") {
                fieldSchema = (fieldSchema as z.ZodString).regex(new RegExp(rule.value), errorMessage);
              }
              break;
            case "min":
              if (field.type === "number") {
                fieldSchema = (fieldSchema as z.ZodNumber).min(rule.value, errorMessage);
              }
              break;
            case "max":
              if (field.type === "number") {
                fieldSchema = (fieldSchema as z.ZodNumber).max(rule.value, errorMessage);
              }
              break;
            case "email":
              fieldSchema = z.string().email(errorMessage);
              break;
            // API validation will be handled separately
          }
        });
      }

      schemaMap[field.name] = fieldSchema;
    });
  });

  return z.object(schemaMap);
};

interface UseReactHookFormProps {
  config: FormConfig;
  recordId?: string | number | null; // Optional record ID for editing
  onSuccess?: (values: Record<string, any>) => void;
  onCancel?: () => void;
}

interface UseReactHookFormResult<TFieldValues extends FieldValues = FieldValues> {
  // Form state
  isOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  values: TFieldValues;
  errors: FieldErrors<TFieldValues>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: string | null;

  // Edit mode state
  isLoadingEditData: boolean;
  editError: string | null;

  // Form methods
  form: UseFormReturn<TFieldValues>;
  setValue: (field: string, value: any) => void;
  setTouched: (field: string, isTouched: boolean) => void;
  setAllTouched: () => void;
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent) => void;
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

  // Step submission related properties and methods
  submitCurrentStep: () => Promise<boolean>;
  isSubmittingStep: boolean;
  stepResponses: Record<number, { success: boolean; message?: string; data?: Record<string, any> }>;
  getStepResponseData: (step: number, key?: string) => any;

  // Error handling
  clearFiledError: (fieldName: string) => void;

  // Form ID
  formId: string;

  // Edit mode actions are now handled by ReactHookFormBuilder
}

export function useReactHookForm<TFieldValues extends FieldValues = FieldValues>({
  config,
  recordId,
  onSuccess,
  onCancel,
}: UseReactHookFormProps): UseReactHookFormResult<TFieldValues> {
  // Use formId from config if provided, otherwise use default
  const actualFormId = config.formId || 'sheet-form';

  // Sheet state
  const [isOpen, setIsOpen] = useState(false);

  // Edit mode state
  const [isLoadingEditData, setIsLoadingEditData] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Create Zod schema from form config
  const schema = createZodSchema(config);

  // Initialize React Hook Form
  const form = useForm<TFieldValues>({
    resolver: zodResolver(schema),
    defaultValues: (config.initialValues || {}) as any,
    mode: 'onBlur',
  });

  const {
    handleSubmit: rhfHandleSubmit,
    reset,
    formState,
    getValues,
    setValue: rhfSetValue,
    trigger,
    clearErrors: rhfClearErrors,
    setError: rhfSetError
  } = form;

  // Local state for sheet-specific functionality
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [touched, setTouchedFields] = useState<Record<string, boolean>>({});

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

  // Edit mode data loading is now handled by ReactHookFormBuilder

  // Reset form when config changes
  useEffect(() => {
    if (config.initialValues) {
      reset(config.initialValues as TFieldValues);
    }
  }, [config, reset]);

  // Edit mode data loading is now handled by ReactHookFormBuilder

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
      reset();
    }
    // Always reset to first step when closing the sheet in step-based mode
    if (isStepBased) {
      setCurrentStep(0);
    }
  }, [config.resetOnSuccess, isStepBased, reset]);

  const clearFiledError = useCallback((fieldName: string) => {
    rhfClearErrors(fieldName as any);
  }, [rhfClearErrors]);

  // Set a field as touched
  const setTouched = useCallback((field: string, isTouched: boolean) => {
    setTouchedFields(prev => ({
      ...prev,
      [field]: isTouched
    }));
  }, []);

  // Set all fields as touched
  const setAllTouched = useCallback(() => {
    const allFields: Record<string, boolean> = {};

    config.sections.forEach(section => {
      section.fields.forEach(field => {
        allFields[field.name] = true;
      });
    });

    setTouchedFields(allFields);
  }, [config.sections]);

  // Validate current step fields
  const validateCurrentStep = useCallback(async () => {
    if (!isStepBased) return true;

    const currentSection = config.sections[currentStep];
    const fieldNames = currentSection.fields
      .filter(field => !field.hidden && (!field.condition || field.condition(getValues() as Record<string, any>)))
      .map(field => field.name);

    return await trigger(fieldNames as any[]);
  }, [config.sections, currentStep, isStepBased, trigger, getValues]);

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Mark all fields as touched
    setAllTouched();

    rhfHandleSubmit(async (data) => {
      setSubmitError(null);
      setSubmitSuccess(false);

      try {
        // For step-based forms, include step response data in the form values
        let finalValues = { ...data };

        if (isStepBased) {
          // Include data from step responses in the final values
          Object.entries(stepResponses).forEach(([stepIndex, response]) => {
            if (response.data) {
              Object.entries(response.data).forEach(([key, value]) => {
                // Skip if the key already exists in values
                if (!(key in finalValues)) {
                  (finalValues as any)[key] = value;
                }
              });

              // Also include IDs directly if they exist
              if (response.data.companyId) {
                (finalValues as any).companyId = response.data.companyId;
              }
              if (response.data.userId) {
                (finalValues as any).userId = response.data.userId;
              }
            }
          });
        }

        // Call the onSubmit handler from config or use default handler
        const submitHandler = config.onSubmit || ((values) => defaultSubmitHandler(values, config));
        const result = await submitHandler(finalValues as Record<string, any>);

        if (result.success) {
          setSubmitSuccess(true);

          // Call onSuccess callback from props if provided
          if (onSuccess) {
            onSuccess({ values: finalValues, result });
          }

          // Call onSuccess callback from config if provided
          if (config.onSuccess) {
            config.onSuccess(finalValues as Record<string, any>, {
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
            reset();
          }
        } else {
          // Handle API error message
          setSubmitError(result.message || "Form submission failed");

          // Call onError callback from config if provided
          if (config.onError) {
            config.onError(finalValues as Record<string, any>, {
              message: result.message,
              errors: result.errors,
            });
          }

          // Handle Laravel validation errors if enabled
          if (config.laravelValidation?.enabled && result.errors) {
            // Convert Laravel validation errors to form errors
            Object.entries(result.errors).forEach(([field, messages]) => {
              const message = Array.isArray(messages) ? messages[0] : messages;
              rhfSetError(field as any, { type: 'server', message: message as string });
            });

            // Call onValidationError callback if provided
            if (config.onValidationError) {
              config.onValidationError(result.errors);
            }
          }
        }
      } catch (error) {
        console.log("Form submission error:", error);
        setSubmitError("An unexpected error occurred");
      }
    })(e);
  }, [
    config,
    rhfHandleSubmit,
    setAllTouched,
    closeSheet,
    reset,
    onSuccess,
    isStepBased,
    stepResponses,
    rhfSetError
  ]);

  // Wizard navigation functions
  const goToNextStep = useCallback(async () => {
    // If validation is required before proceeding
    if (config.wizardOptions?.validateStepBeforeNext) {
      const isValid = await validateCurrentStep();
      if (!isValid) {
        // Mark all fields in the current step as touched
        const currentStepTouched: Record<string, boolean> = {};
        config.sections[currentStep].fields.forEach((field) => {
          currentStepTouched[field.name] = true;
        });
        setTouchedFields(prev => ({
          ...prev,
          ...currentStepTouched
        }));
        return;
      }
    }

    // Move to the next step
    const nextStep = Math.min(currentStep + 1, totalSteps - 1);

    // Call onStepChange callback if provided
    if (config.wizardOptions?.onStepChange) {
      config.wizardOptions.onStepChange(
        currentStep,
        nextStep,
        getValues() as Record<string, any>
      );
    }

    setCurrentStep(nextStep);
  }, [
    config.wizardOptions,
    config.sections,
    currentStep,
    totalSteps,
    validateCurrentStep,
    getValues
  ]);

  const goToPrevStep = useCallback(() => {
    // Move to the previous step
    const prevStep = Math.max(currentStep - 1, 0);

    // Call onStepChange callback if provided
    if (config.wizardOptions?.onStepChange) {
      config.wizardOptions.onStepChange(
        currentStep,
        prevStep,
        getValues() as Record<string, any>
      );
    }

    setCurrentStep(prevStep);
  }, [config.wizardOptions, currentStep, getValues]);

  const goToStep = useCallback(
    (step: number) => {
      // Ensure step is within bounds
      const targetStep = Math.max(0, Math.min(step, totalSteps - 1));

      // Call onStepChange callback if provided
      if (config.wizardOptions?.onStepChange) {
        config.wizardOptions.onStepChange(
          currentStep,
          targetStep,
          getValues() as Record<string, any>
        );
      }

      setCurrentStep(targetStep);
    },
    [config.wizardOptions, currentStep, totalSteps, getValues]
  );

  // Submit current step
  const submitCurrentStep = useCallback(async () => {
    // Validate current step
    const isValid = await validateCurrentStep();
    if (!isValid) {
      // Mark all fields in the current step as touched
      const currentStepTouched: Record<string, boolean> = {};
      config.sections[currentStep].fields.forEach((field) => {
        currentStepTouched[field.name] = true;
      });
      setTouchedFields(prev => ({
        ...prev,
        ...currentStepTouched
      }));
      return false;
    }

    setIsSubmittingStep(true);

    try {
      // Get current values
      const values = getValues() as Record<string, any>;

      // Use custom step submission handler if provided, otherwise use default
      const stepSubmitHandler =
        config.wizardOptions?.onStepSubmit ||
        ((step, values) => defaultStepSubmitHandler(step, values, config));

      const result = await stepSubmitHandler(currentStep, values);

      // Store step response
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
        // Set form errors
        Object.entries(result.errors).forEach(([field, message]) => {
          const errorMessage = Array.isArray(message) ? message[0] : message;
          rhfSetError(field as any, { type: 'server', message: errorMessage as string });
        });

        // Mark fields with errors as touched
        const fieldsWithErrors: Record<string, boolean> = {};
        Object.keys(result.errors).forEach((field) => {
          fieldsWithErrors[field] = true;
        });
        setTouchedFields(prev => ({
          ...prev,
          ...fieldsWithErrors
        }));
      }

      return result.success;
    } catch (error) {
      console.log("Step submission error:", error);
      return false;
    } finally {
      setIsSubmittingStep(false);
    }
  }, [
    config,
    currentStep,
    validateCurrentStep,
    getValues,
    rhfSetError
  ]);

  // Get step response data
  const getStepResponseData = useCallback(
    (step: number, key?: string) => {
      const response = stepResponses[step];
      if (!response || !response.data) return undefined;

      if (key) {
        return response.data[key];
      }

      return response.data;
    },
    [stepResponses]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
    closeSheet();
  }, [onCancel, closeSheet]);

  // Reset form
  const resetForm = useCallback(() => {
    reset();
    setTouchedFields({});
    setSubmitSuccess(false);
    setSubmitError(null);
  }, [reset]);

  // Set value wrapper
  const setValue = useCallback((field: string, value: any) => {
    rhfSetValue(field as any, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    // Clear any existing errors for this field when the value changes
    rhfClearErrors(field as any);

    // Check if field has API validation rules and trigger validation
    const fieldConfig = config.sections
      .flatMap(section => section.fields)
      .find(f => f.name === field);

    if (fieldConfig?.validation && hasApiValidation(fieldConfig.validation)) {
      fieldConfig.validation.forEach(rule => {
        if (rule.type === 'apiValidation' && rule.apiConfig) {
          // Trigger API validation
          setTimeout(() => {
            // Make API request
            if (!rule.apiConfig) return;

            const url = rule.apiConfig.url;
            const method = rule.apiConfig.method || "GET";
            const paramName = rule.apiConfig.paramName || "value";
            const headers = rule.apiConfig.headers || {};
            const successCondition = rule.apiConfig.successCondition;

            // Prepare fetch options
            const fetchOptions: RequestInit = {
              method,
              headers: headers as HeadersInit,
            };

            // For POST/PUT requests, add the body
            if (method !== "GET") {
              fetchOptions.body = JSON.stringify({ [paramName]: value });
              if (!fetchOptions.headers) {
                fetchOptions.headers = {};
              }
              (fetchOptions.headers as Record<string, string>)['Content-Type'] = 'application/json';
            }

            // Prepare request config for apiClient
            const config = {
              method,
              url,
              headers: headers as Record<string, string>,
              ...(method === "GET"
                ? { params: { [paramName]: value } }
                : { data: { [paramName]: value } }),
            };

            // Use apiClient instead of fetch
            apiClient(config)
              .then(response => {
                // Check if validation passed
                let isValid = false;
                const data = response.data;

                if (successCondition) {
                  // Use the provided success condition
                  isValid = successCondition(data);
                } else if (data.available !== undefined) {
                  // Check if the API returns an 'available' property
                  isValid = data.available === true;
                } else if (data.success !== undefined) {
                  // Check if the API returns a 'success' property
                  isValid = data.success === true;
                } else if (data.valid !== undefined) {
                  // Check if the API returns a 'valid' property
                  isValid = data.valid === true;
                } else if (data.isValid !== undefined) {
                  // Check if the API returns an 'isValid' property
                  isValid = data.isValid === true;
                }

                // Set error if validation failed
                if (!isValid) {
                  rhfSetError(field as any, { type: 'apiValidation', message: rule.message as string });
                }
              })
              .catch(error => {
                console.error('API validation error:', error);
                rhfSetError(field as any, { type: 'apiValidation', message: rule.message as string });
              });
          }, rule.apiConfig.debounceMs || 500);
        }
      });
    }
  }, [rhfSetValue, rhfClearErrors, rhfSetError, config.sections]);

  return {
    // Form state
    isOpen,
    openSheet,
    closeSheet,
    values: getValues() as TFieldValues,
    errors: formState.errors,
    touched,
    isSubmitting: formState.isSubmitting,
    submitSuccess,
    submitError,

    // Edit mode state
    isLoadingEditData,
    editError,

    // Form methods
    form,
    setValue,
    setTouched,
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

    // Step submission related properties and methods
    submitCurrentStep,
    isSubmittingStep,
    stepResponses,
    getStepResponseData,

    // Error handling
    clearFiledError,

    // Form ID
    formId: actualFormId,

    // Edit mode actions are now handled by ReactHookFormBuilder
  };
}
