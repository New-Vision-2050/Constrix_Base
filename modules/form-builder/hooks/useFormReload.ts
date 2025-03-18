"use client";
import { useCallback } from "react";
import { useFormStore } from "./useFormStore";

/**
 * Hook to reload a form by resetting its state
 * This is useful when you need to trigger a form reset from outside the form component
 */
export const useFormReload = () => {
  /**
   * Reload a form by resetting its state
   * @param formId The ID of the form to reload
   * @param initialValues Optional initial values to set when reloading
   */
  const reloadForm = useCallback((formId: string, initialValues: Record<string, any> = {}) => {
    // Get the form store
    const formStore = useFormStore.getState();
    
    // Reset the form with the provided initial values
    formStore.resetForm(formId, initialValues);
    
    return true;
  }, []);

  return { reloadForm };
};

/**
 * Hook to reload a form with a delay
 * This is useful when you need to trigger a form reset with a delay, for example after a successful submission
 */
export const useFormReloadWithDelay = () => {
  const { reloadForm } = useFormReload();

  /**
   * Reload a form with a delay
   * @param formId The ID of the form to reload
   * @param initialValues Optional initial values to set when reloading
   * @param delayMs Delay in milliseconds before reloading (default: 100ms)
   */
  const reloadFormWithDelay = useCallback(
    (formId: string, initialValues: Record<string, any> = {}, delayMs = 100) => {
      // Set a timeout to reload the form after the specified delay
      setTimeout(() => {
        reloadForm(formId, initialValues);
      }, delayMs);

      return true;
    },
    [reloadForm]
  );

  return { reloadFormWithDelay };
};