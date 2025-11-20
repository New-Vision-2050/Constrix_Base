import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CompanyDashboardTermsConditionsApi } from "@/services/api/company-dashboard/terms-conditions";
import { UpdateTermsConditionsParams } from "@/services/api/company-dashboard/terms-conditions/types/params";
import { toast } from "sonner";

/**
 * Custom hook for managing Terms and Conditions
 * 
 * Follows SOLID principles:
 * - Single Responsibility: Handles only T&C data fetching and updates
 * - Open/Closed: Extensible without modifying existing code
 * - Dependency Inversion: Depends on API abstraction
 * 
 * @param t - Translation function for user messages
 * @returns Object containing query data, loading states, and mutation function
 * 
 * @example
 * const { data, isLoading, updateTermsConditions } = useTermsConditions(t);
 */
export const useTermsConditions = (t: (key: string) => string) => {
  const queryClient = useQueryClient();

  // Fetch current terms and conditions
  const query = useQuery({
    queryKey: ["terms-conditions", "current"],
    queryFn: async () => {
      const response = await CompanyDashboardTermsConditionsApi.getCurrent();
      return response.data;
    },
  });

  // Update terms and conditions mutation
  const mutation = useMutation({
    mutationFn: (params: UpdateTermsConditionsParams) =>
      CompanyDashboardTermsConditionsApi.updateCurrent(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["terms-conditions"] });
      toast.success(
        t("updateSuccess") || "Terms and conditions updated successfully!"
      );
    },
    onError: (error: any) => {
      console.error("Error updating terms and conditions:", error);

      if (error?.response?.status === 422) {
        const validationErrors = error?.response?.data?.errors;
        if (validationErrors) {
          const firstErrorKey = Object.keys(validationErrors)[0];
          const firstErrorMessage = validationErrors[firstErrorKey][0];
          toast.error(firstErrorMessage || t("validationError"));
          return;
        }
      }

      toast.error(
        t("updateError") ||
          "Failed to update terms and conditions. Please try again."
      );
    },
  });

  return {
    data: query.data?.payload,
    isLoading: query.isLoading,
    error: query.error,
    updateTermsConditions: mutation.mutate,
    isUpdating: mutation.isPending,
  };
};

