import { useState, useEffect, useCallback, useMemo } from 'react';
import { FormConfig, ValidationRule } from '../types/formTypes';
import { useFormStore, validateField } from '../store/useFormStore';
import { useToast } from '@/modules/table/hooks/use-toast';
import { fetchWithAuth } from '@/utils/fetchUtils';

export const useFormBuilder = (config: FormConfig) => {
    // Create a stable reference to the config
    const stableConfig = useMemo(() => config, [
        // Only include the properties that should trigger a rerender when changed
        config.apiUrl,
        config.laravelValidation,
        config.onSubmit,
        config.onCancel,
        config.onValidationError,
        config.resetOnSuccess,
        // Don't include sections or fields in the dependency array
        // as they can cause unnecessary rerenders
    ]);
    
    // IMPORTANT: Don't subscribe to values, errors, or touched
    // Only subscribe to isSubmitting and submitCount which are needed for UI updates
    const isSubmitting = useFormStore(state => state.isSubmitting);
    const submitCount = useFormStore(state => state.submitCount);
    
    // Get actions from the store without subscribing
    const storeActions = useMemo(() => {
        const store = useFormStore.getState();
        return {
            setValue: store.setValue,
            setValues: store.setValues,
            setError: store.setError,
            setErrors: store.setErrors,
            setTouched: store.setTouched,
            setAllTouched: store.setAllTouched,
            resetForm: store.resetForm,
            setSubmitting: store.setSubmitting,
            setIsValid: store.setIsValid,
            incrementSubmitCount: store.incrementSubmitCount
        };
    }, []);
    
    const [initialValuesLoaded, setInitialValuesLoaded] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (config.initialValues && !initialValuesLoaded) {
            storeActions.resetForm(config.initialValues);
            setInitialValuesLoaded(true);
        }
    }, [config.initialValues, storeActions, initialValuesLoaded]);

    const handleReset = useCallback(() => {
        storeActions.resetForm(config.initialValues);
    }, [storeActions.resetForm, config.initialValues]);

    const handleCancel = useCallback(() => {
        if (config.onCancel) {
            config.onCancel();
        }
    }, [config.onCancel]);

    // Function to check if a section should be displayed
    // This doesn't subscribe to values, it gets them directly when needed
    const shouldDisplaySection = useCallback((condition?: (values: Record<string, any>) => boolean) => {
        if (!condition) {
            return true;
        }
        
        // Get values directly from the store without subscribing
        const values = useFormStore.getState().values;
        return condition(values);
    }, []);

    // Function to handle Laravel validation errors
    const handleLaravelValidationErrors = useCallback((response: any) => {
        if (!stableConfig.laravelValidation?.enabled) return false;

        const errorsPath = stableConfig.laravelValidation.errorsPath || 'errors';
        const laravelErrors = response[errorsPath];

        if (!laravelErrors || typeof laravelErrors !== 'object') {
            return false;
        }

        const formattedErrors: Record<string, string> = {};

        // Laravel typically returns errors as an object with field names as keys
        // and arrays of error messages as values
        Object.entries(laravelErrors).forEach(([key, value]) => {
            // If the value is an array, take the first error message
            if (Array.isArray(value)) {
                formattedErrors[key] = value[0];
            } else if (typeof value === 'string') {
                // If it's already a string, use it directly
                formattedErrors[key] = value;
            }
        });

        if (Object.keys(formattedErrors).length > 0) {
            storeActions.setErrors(formattedErrors);
            storeActions.setAllTouched();

            if (stableConfig.onValidationError) {
                stableConfig.onValidationError(formattedErrors);
            }
            return true;
        }

        return false;
    }, [stableConfig, storeActions]);

    // Function to submit form data to backend API
    const submitToApi = useCallback(async (values: Record<string, any>) => {
        if (!stableConfig.apiUrl) {
            return { success: true }; // No API URL, consider it successful
        }

        try {
            // Use the centralized fetch utility for POST requests
            const response = await fetchWithAuth(stableConfig.apiUrl, {
                method: 'POST',
                headers: stableConfig.apiHeaders,
                body: JSON.stringify(values)
            });

            const data = await response.json();

            // Check for Laravel validation errors
            if (!response.ok && stableConfig.laravelValidation?.enabled) {
                const hasLaravelErrors = handleLaravelValidationErrors(data);
                if (hasLaravelErrors) {
                    return { success: false, errors: data.errors };
                }
            }

            return {
                success: response.ok,
                message: data.message,
                errors: data.errors
            };
        } catch (error) {
            toast({
                title: "Submission Error",
                description: "Failed to submit the form. Please try again.",
                variant: "destructive",
            });
            return { success: false };
        }
    }, [stableConfig, handleLaravelValidationErrors, toast]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        // Get the current state directly without subscribing
        const store = useFormStore.getState();
        const values = store.values;
        
        // Mark all fields as touched first to display validation errors
        storeActions.setAllTouched();
        storeActions.incrementSubmitCount();

        const formErrors: Record<string, string> = {};
        let hasErrors = false;

        // Validate all fields in visible sections
        stableConfig.sections.forEach(section => {
            if (shouldDisplaySection(section.condition)) {
                section.fields.forEach(field => {
                    // Skip validation for fields that are conditionally hidden or disabled
                    if ((field.condition && !field.condition(values)) ||
                        field.disabled || field.readOnly) {
                        return;
                    }

                    const value = values[field.name];

                    if (field.validation && field.validation.length > 0) {
                        const error = validateField(value, field.validation, values);

                        if (error) {
                            formErrors[field.name] = error;
                            hasErrors = true;
                        }
                    }
                });
            }
        });

        // Update the form state with validation errors
        storeActions.setErrors(formErrors);

        if (hasErrors) {
            if (stableConfig.onValidationError) {
                stableConfig.onValidationError(formErrors);
            }
            return;
        }

        storeActions.setSubmitting(true);

        try {
            // First, submit to the API if URL is provided
            if (stableConfig.apiUrl) {
                const apiResult = await submitToApi(values);

                if (!apiResult.success) {
                    storeActions.setSubmitting(false);
                    return;
                }
            }

            // Then call the onSubmit callback
            const result = await stableConfig.onSubmit(values);

            // Check for Laravel validation errors in the response
            if (result.errors && stableConfig.laravelValidation?.enabled) {
                const hasLaravelErrors = handleLaravelValidationErrors({
                    errors: result.errors
                });

                if (hasLaravelErrors) {
                    storeActions.setSubmitting(false);
                    return;
                }
            }

            if (result.success) {
                toast({
                    title: "Success",
                    description: result.message || "Form submitted successfully",
                    variant: "default",
                });

                if (stableConfig.resetOnSuccess !== false && stableConfig.initialValues) {
                    storeActions.resetForm(stableConfig.initialValues);
                }
            }
        } catch (error: any) {
            // Try to handle Laravel validation errors from the caught error
            if (stableConfig.laravelValidation?.enabled && error.response?.data) {
                const hasLaravelErrors = handleLaravelValidationErrors(error.response.data);
                if (!hasLaravelErrors) {
                    // If no Laravel errors were found, check for a standard error message
                    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';

                    toast({
                        title: "Error",
                        description: errorMessage,
                        variant: "destructive",
                    });
                }
            } else {
                toast({
                    title: "Error",
                    description: error.message || "An error occurred during submission",
                    variant: "destructive",
                });
            }
        } finally {
            storeActions.setSubmitting(false);
        }
    }, [
        stableConfig,
        storeActions,
        shouldDisplaySection,
        handleLaravelValidationErrors,
        submitToApi,
        toast
    ]);

    // For the return values, we need to provide values, errors, and touched
    // for backward compatibility, but we get them directly from the store
    // without subscribing
    const getStoreValues = useCallback(() => {
        return useFormStore.getState().values;
    }, []);
    
    const getStoreErrors = useCallback(() => {
        return useFormStore.getState().errors;
    }, []);
    
    const getStoreTouched = useCallback(() => {
        return useFormStore.getState().touched;
    }, []);

    return {
        // These are functions that get the latest values without subscribing
        get values() { return getStoreValues(); },
        get errors() { return getStoreErrors(); },
        get touched() { return getStoreTouched(); },
        
        // These are actual subscriptions that will cause rerenders
        isSubmitting,
        submitCount,
        
        // Actions and handlers
        setValue: storeActions.setValue,
        setValues: storeActions.setValues,
        setError: storeActions.setError,
        setTouched: storeActions.setTouched,
        setAllTouched: storeActions.setAllTouched,
        resetForm: storeActions.resetForm,
        setSubmitting: storeActions.setSubmitting,
        setIsValid: storeActions.setIsValid,
        incrementSubmitCount: storeActions.incrementSubmitCount,
        handleSubmit,
        handleReset,
        handleCancel,
        shouldDisplaySection,
        handleLaravelValidationErrors,
    };
};
