import { FormConfig } from "@/modules/form-builder";
import { apiClient } from "@/config/axios-config";
import { serialize } from "object-to-formdata";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useFinancialDataCxt } from "../../context/financialDataCxt";

export const SalaryFormConfig = () => {
  const { user, handleRefetchDataStatus } = useUserProfileCxt();
  const { userSalary, handleRefreshSalaryData } = useFinancialDataCxt();

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
            label: "الراتب الاساسي",
            type: "text",
            placeholder: "الراتب الاساسي",
            validation: [
              {
                type: "required",
                message: "الراتب الاساسي مطلوب",
              },
            ],
          },
          {
            name: "salary",
            label: "مبلغ الراتب الاساسي",
            type: "number",
            placeholder: "مبلغ الراتب الاساسي",
            validation: [
              {
                type: "required",
                message: "مبلغ الراتب الاساسي مطلوب",
              },
            ],
          },
          {
            name: "type",
            label: "دورة القبض",
            type: "text",
            placeholder: "دورة القبض",
            validation: [
              {
                type: "required",
                message: "دورة القبض مطلوب",
              },
            ],
          },
          {
            name: "description",
            label: "وصف اساس حساب الراتب",
            type: "text",
            placeholder: "وصف اساس حساب الراتب",
            validation: [
              {
                type: "required",
                message: "وصف اساس حساب الراتب مطلوب",
              },
            ],
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      basic: userSalary?.basic,
      salary: userSalary?.salary,
      type: userSalary?.type,
      description: userSalary?.description,
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
      handleRefetchDataStatus();
      handleRefreshSalaryData();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const body = {
        ...formData,
        user_id: user?.user_id,
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
