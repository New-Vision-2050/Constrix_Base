import { toast } from "@/modules/table/hooks/use-toast";

// Simple function to extract error message from API error response
export const getErrorMessage = (error: any): string => {
  if (!error) return "Errors.Authentication.GenericError";
  
  // Try to get the error message from the response
  const description = error.response?.data?.message?.description;
  return description || "Errors.Authentication.GenericError";
};

// Function to show a toast notification for errors
export const showErrorToast = (titleKey: string, messageKey: string) => {
  toast({
    variant: "destructive",
    title: titleKey,
    description: messageKey,
  });
};

// Global error event for components to listen to
export const errorEvent = new EventTarget();

// Function to dispatch an error event
export const dispatchErrorEvent = (status: number, messageKey: string) => {
  const event = new CustomEvent('auth-error', {
    detail: { status, messageKey }
  });
  errorEvent.dispatchEvent(event);
};