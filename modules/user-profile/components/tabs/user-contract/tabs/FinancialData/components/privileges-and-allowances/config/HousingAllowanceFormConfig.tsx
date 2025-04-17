import { FormConfig } from "@/modules/form-builder";
import { apiClient } from "@/config/axios-config";
import { serialize } from "object-to-formdata";
// import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

export const SalaryFormConfig = () => {
  //   const { user } = useUserProfileCxt();
  //   const { userSalary, handleRefreshSalaryData } = useFinancialDataCxt();

  const salaryFormConfig: FormConfig = {
    formId: "salary-data-form",
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "basic",
            label: "الراتب",
            type: "text",
            placeholder: "الراتب",
            validation: [
              {
                type: "required",
                message: "الراتب مطلوب",
              },
            ],
          },
          {
            name: "basic",
            label: "الراتب",
            type: "text",
            placeholder: "الراتب",
            validation: [
              {
                type: "required",
                message: "الراتب مطلوب",
              },
            ],
          },
          {
            name: "basic",
            label: "الراتب",
            type: "text",
            placeholder: "الراتب",
            validation: [
              {
                type: "required",
                message: "الراتب مطلوب",
              },
            ],
          },
          {
            name: "basic",
            label: "الراتب",
            type: "text",
            placeholder: "الراتب",
            validation: [
              {
                type: "required",
                message: "الراتب مطلوب",
              },
            ],
          },
        ],
      },
    ],
    initialValues: {
      //   basic: userSalary?.basic,
      //   salary: userSalary?.salary,
      //   type: userSalary?.type,
      //   description: userSalary?.description,
    },
    submitButtonText: "Submit",
    cancelButtonText: "Cancel",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSuccess: () => {
      //   handleRefreshSalaryData();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const body = {
        ...formData,
        // user_id: user?.user_id,
      };

      const response = await apiClient.post(`/user_salaries`, serialize(body));

      return {
        success: true,
        message: response.data?.message || "Form submitted successfully",
        data: response.data || {},
      };
    },
  };
  return salaryFormConfig;
};
