import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { serialize } from "object-to-formdata";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useFinancialDataCxt } from "../../context/financialDataCxt";
import {defaultSubmitHandler} from "@/modules/form-builder/utils/defaultSubmitHandler";

export const SalaryFormConfig = () => {
  const { user, handleRefetchDataStatus } = useUserProfileCxt();
  const { userSalary, handleRefreshSalaryData } = useFinancialDataCxt();

  const salaryFormConfig: FormConfig = {
    formId: "salary-data-form",
      apiUrl: `${baseURL}/user_salaries`,
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
            type: "select",
            name: "type",
            label: "دورة القبض",
            placeholder: "اختر دورة القبض",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/periods`,
              valueField: "name",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: "ادخل دورة القبض",
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
    return await defaultSubmitHandler(body,salaryFormConfig);
    },
  };
  return salaryFormConfig;
};
