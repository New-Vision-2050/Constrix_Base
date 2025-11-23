import { useMutation } from "@tanstack/react-query";
import { CompanyDashboardTermsConditionsApi } from "@/services/api/company-dashboard/terms-conditions";
import { UpdateTermsConditionsParams } from "@/services/api/company-dashboard/terms-conditions/types/params";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

/**
 * Custom hook for updating Terms and Conditions
 * Only handles mutations, data fetching is done server-side
 * @param t - Translation function for user messages
 * @returns Object containing mutation function and loading state
 */
export const useUpdateTermsConditions = (t: (key: string) => string) => {
  const router = useRouter();

  // Update terms and conditions mutation
  const mutation = useMutation({
    mutationFn: (params: UpdateTermsConditionsParams) =>
      CompanyDashboardTermsConditionsApi.updateCurrent(params),
    onSuccess: () => {
      router.refresh(); // Refresh server component to get updated data
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
    updateTermsConditions: mutation.mutate,
    isUpdating: mutation.isPending,
  };
};

