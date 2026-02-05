import { apiClient, baseURL } from "@/config/axios-config";
import { FormConfig, useFormStore } from "@/modules/form-builder";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useFinancialDataCxt } from "../../context/financialDataCxt";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { SalaryTypes } from "./salary_type_enum";
import {useTranslations} from "next-intl";

// Helper to get period name from period ID
const getPeriodName = async (periodId: string) => {
  try {
    const response = await apiClient.get(`${baseURL}/periods`);
    const periods = response.data.payload;
    const periodName = periods?.find(
      (period: any) => period.id === periodId
    )?.name;
    console.log("periodName", periodName);
    return periodName;
  } catch (error) {
    console.error("Error fetching period name:", error);
    return null;
  }
};

// Helper function to calculate hourly rate based on payment period and salary
const calculateHourlyRate = (
  periodId: string | undefined,
  salary: number | string | undefined,
  periodName?: string
) => {
  if (!periodId || !salary) return "";

  const salaryValue = Number(salary);
  if (isNaN(salaryValue) || salaryValue <= 0) return "";

  // If periodName is directly provided (from existing formValues), use it
  // Otherwise, try to use the cached name from our map
  const nameToUse = periodName;

  if (!nameToUse) {
    // If we don't have the name yet, return a temporary value
    // The actual calculation will happen after we fetch the name
    return "";
  }

  // Use Arabic period names to determine formula
  const nameLower = nameToUse.toLowerCase();

  if (nameLower.includes("يومي") || nameLower.includes("daily")) {
    // Daily period: salary / (9 hours per day)
    return (salaryValue / 9).toFixed(2);
  } else if (nameLower.includes("اسبوع") || nameLower.includes("weekly")) {
    // Weekly period: salary / (48 hours per week )
    return (salaryValue / 48).toFixed(2);
  } else if (nameLower.includes("شهري") || nameLower.includes("monthly")) {
    // Monthly period: salary / 192 hours per month
    return (salaryValue / 192).toFixed(2);
  } else if (nameLower.includes("سنوي") || nameLower.includes("yearly")) {
    // Yearly period: salary / (12 months * 192 hours per month)
    return (salaryValue / (12 * 192)).toFixed(2);
  } else {
    // Default case - unknown period type
    return "";
  }
};

export const SalaryFormConfig = () => {
  const t = useTranslations("UserProfile");
  // declare and define component state and variables
  const { userId, handleRefetchDataStatus } = useUserProfileCxt();
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
            label: t("header.salary.basicSalary"),
            type: "select",
            placeholder: t("header.salary.basicSalary"),
            required: true,
            dynamicOptions: {
              url: `${baseURL}/salary_types`,
              valueField: "code",
              labelField: "name",
              searchParam: "name",

              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: t("header.salary.basicSalaryRequired"),
              },
            ],
            onChange: async (
              newValue: any,
              values: Record<string, any>,
              formId?: string
            ) => {
              const formStore = useFormStore.getState();
              
              // If type changed to constant and salary and period exist, calculate hour rate
              if (newValue === SalaryTypes.constants && values.salary && values.period_id) {
                try {
                  // Get period name
                  const periodName = await getPeriodName(values.period_id);
                  
                  // Calculate hourly rate
                  const hourlyRate = calculateHourlyRate(
                    values.period_id,
                    values.salary,
                    periodName
                  );
                  
                  // Update hour rate in the form
                  formStore.setValues("salary-data-form", {
                    hour_rate: hourlyRate,
                  });
                } catch (error) {
                  console.error("Error calculating hourly rate:", error);
                  formStore.setValues("salary-data-form", {
                    hour_rate: "",
                  });
                }
              } else if (newValue !== SalaryTypes.constants) {
                // If type is not constant, clear hour rate
                formStore.setValues("salary-data-form", {
                  hour_rate: "",
                });
              }
            },
          },
          {
            name: "salary",
            label: t("header.salary.basicSalaryAmount"),
            type: "text",
            placeholder: t("header.salary.basicSalaryAmount"),
            validation: [
              {
                type: "required",
                message: t("header.salary.basicSalaryAmountRequired"),
              },
            ],
            condition: (values) =>
              values.salary_type_code == SalaryTypes.percentage,
            postfix: "%",
            onChange: (
              newValue: any,
              values: Record<string, any>,
              formId?: string
            ) => {
              // No need to calculate hourly rate for percentage-based salary
              if (!formId) return;

              // Reset the hour_rate when salary changes
              const formStore = useFormStore.getState();
              formStore.setValues(formId, {
                hour_rate: "",
              });
            },
          },
          {
            name: "salary",
            label: t("header.salary.basicSalaryAmount"),
            type: "text",
            placeholder: t("header.salary.basicSalaryAmount"),
            validation: [
              {
                type: "required",
                message: t("header.salary.basicSalaryAmountRequired"),
              },
            ],
            condition: (values) =>
              values.salary_type_code == SalaryTypes.constants,
            postfix: "ر.س",
            onChange: async (
              newValue: any,
              values: Record<string, any>,
              formId?: string
            ) => {
              const formStore = useFormStore.getState();

              // If we have both salary and period_id, calculate hourly rate
              if (newValue && values.period_id) {
                // Try to get the cached period name first
                let periodName = await getPeriodName(values.period_id);

                const hourlyRate = calculateHourlyRate(
                  values.period_id,
                  newValue,
                  periodName
                );

                formStore.setValues("salary-data-form", {
                  hour_rate: hourlyRate,
                });
              } else {
                // Reset the hour_rate if salary is cleared
                formStore.setValues("salary-data-form", {
                  hour_rate: "",
                });
              }
            },
          },
          {
            type: "select",
            name: "period_id",
            label: t("header.salary.paymentPeriod"),
            placeholder: t("header.salary.paymentPeriodPlaceholder"),
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
                message: t("header.salary.paymentPeriodRequired"),
              },
            ],
            onChange: async (
              newValue: any,
              values: Record<string, any>,
              formId?: string
            ) => {
              const formStore = useFormStore.getState();
              console.log("values", values);

              // If this is for constant salary type and we have a salary value, calculate the hourly rate
              if (values.salary) {
                try {
                  // Fetch the selected period's name
                  const periodName = await getPeriodName(newValue);

                  // Calculate with the period name
                  const hourlyRate = calculateHourlyRate(
                    newValue,
                    values.salary,
                    periodName
                  );

                  formStore.setValues("salary-data-form", {
                    hour_rate: hourlyRate,
                  });
                } catch (error) {
                  formStore.setValues("salary-data-form", {
                    hour_rate: "",
                  });
                }
              } else {
                // Reset the hour_rate when period changes and no calculation is possible
                formStore.setValues("salary-data-form", {
                  hour_rate: "",
                });
              }
            },
          },
          {
            name: "description",
            label: t("header.salary.salaryDescription"),
            type: "text",
            placeholder: t("header.salary.salaryDescriptionPlaceholder"),
            condition: (values) =>
              values.salary_type_code === SalaryTypes.percentage,
            validation: [
              {
                type: "required",
                message: t("header.salary.salaryDescriptionRequired"),
              },
            ],
          },
          {
            name: "hour_rate",
            label: t("header.salary.hourlyRate"),
            type: "number",
            postfix: "ر.س",
            placeholder: t("header.salary.hourlyRatePlaceholder") ,
            condition: (values) =>
              values.salary_type_code === SalaryTypes.constants,
            validation: [
              {
                type: "required",
                message: t("header.salary.hourlyRateRequired"),
              },
            ],
            // Make this field readonly since it's now calculated automatically
            disabled: true,
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
    submitButtonText: t("header.salary.save"),
    cancelButtonText: t("header.salary.cancel"),
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
        user_id: userId,
      };
      return await defaultSubmitHandler(body, salaryFormConfig);
    },
  };
  return salaryFormConfig;
};
