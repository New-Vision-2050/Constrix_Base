import { baseURL } from "@/config/axios-config";
import { FormConfig } from "@/modules/form-builder";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useFinancialDataCxt } from "../../context/financialDataCxt";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { SalaryTypes } from "./salary_type_enum";
import { useState } from "react";

export const SalaryFormConfig = () => {
  // declare and define component state and variables
  const [salaryType, setSalaryType] = useState("");
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
            name: "salary_type_code",
            label: "الراتب الاساسي",
            type: "select",
            placeholder: "الراتب الاساسي",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/salary_types`,
              valueField: "code",
              labelField: "name",
              searchParam: "name",

              totalCountHeader: "X-Total-Count",
            },
            onChange(newValue) {
              setSalaryType(newValue);
            },
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
            type: "text",
            placeholder: "مبلغ الراتب الاساسي",
            validation: [
              {
                type: "required",
                message: "مبلغ الراتب الاساسي مطلوب",
              },
            ],
            postfix: salaryType === SalaryTypes.percentage ? "%" : "ر.س",
          },
          {
            type: "select",
            name: "period_id",
            label: "دورة القبض",
            placeholder: "اختر دورة القبض",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/periods`,
              valueField: "id",
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
            condition: (values) =>
              values.salary_type_code === SalaryTypes.constants,
            validation: [
              {
                type: "required",
                message: "وصف اساس حساب الراتب مطلوب",
              },
            ],
          },
          {
            name: "hour_rate",
            label: "قيمة الساعة",
            type: "text",
            placeholder: "قيمة الساعة",
            condition: (values) =>
              values.salary_type_code === SalaryTypes.percentage,
            validation: [
              {
                type: "required",
                message: "قيمة الساعة مطلوب",
              },
            ],
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      salary_type_code: userSalary?.salary_type_code,
      salary: userSalary?.salary,
      period_id: userSalary?.period_id,
      description: userSalary?.description,
      hour_rate: userSalary?.hour_rate,
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
      return await defaultSubmitHandler(body, salaryFormConfig);
    },
  };
  return salaryFormConfig;
};
