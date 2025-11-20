import { useEffect } from "react";
import { FieldErrors } from "react-hook-form";
import { toast } from "sonner";

/**
 * Custom hook for displaying form validation errors as toasts
 * 
 * Follows Single Responsibility Principle - only handles error notifications
 * Reusable across different forms
 * 
 * @param errors - React Hook Form errors object
 */
export const useFormErrorToast = (errors: FieldErrors) => {
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      if (firstError?.message) {
        toast.error(firstError.message as string);
      }
    }
  }, [errors]);
};

