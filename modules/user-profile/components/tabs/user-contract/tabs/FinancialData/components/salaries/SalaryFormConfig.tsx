import { apiClient, baseURL } from "@/config/axios-config";
import { FormConfig, useFormStore } from "@/modules/form-builder";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useFinancialDataCxt } from "../../context/financialDataCxt";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { SalaryTypes } from "./salary_type_enum";
import useUserContractData from "../../../FunctionalAndContractualData/hooks/useUserContractData";

// Helper to get period name from period ID
const getPeriodName = async (periodId: string) => {
  try {
    const response = await apiClient.get(`${baseURL}/periods`);
    const periods = response.data.payload;
    const periodName = periods?.find(
      (period: any) => period.id === periodId,
    )?.name;
    console.log("periodName", periodName);
    return periodName;
  } catch (error) {
    console.error("Error fetching period name:", error);
    return null;
  }
};

// Helper function to calculate hourly rate based on payment period and salary
// Using userContractData for weekly work hours
// Total hours equations:
// 1 month = Weekly work hours * 4
// 1 day = Weekly work hours * 4 / 30
// 1 year = Weekly work hours * 4 * 12
// 1 week = Weekly work hours
//
// Hourly rate = Salary / Total hours for period
const calculateHourlyRate = (
  periodId: string | undefined,
  salary: number | string | undefined,
  weeklyWorkHours: number | undefined,
  periodName?: string,
) => {
  if (!periodId || !salary || !weeklyWorkHours) return "";

  const salaryValue = Number(salary);
  if (isNaN(salaryValue) || salaryValue <= 0) return "";

  if (weeklyWorkHours <= 0) return "";

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

  let totalHours = 0;

  if (nameLower.includes("يومي") || nameLower.includes("daily")) {
    // Daily: Total hours = Weekly work hours * 4 / 30
    totalHours = (weeklyWorkHours * 4) / 30;
  } else if (nameLower.includes("اسبوع") || nameLower.includes("weekly")) {
    // Weekly: Total hours = Weekly work hours
    totalHours = weeklyWorkHours;
  } else if (nameLower.includes("شهري") || nameLower.includes("monthly")) {
    // Monthly: Total hours = Weekly work hours * 4
    totalHours = weeklyWorkHours * 4;
  } else if (nameLower.includes("سنوي") || nameLower.includes("yearly")) {
    // Yearly: Total hours = Weekly work hours * 4 * 12
    totalHours = weeklyWorkHours * 4 * 12;
  } else {
    // Default case - unknown period type
    return "";
  }

  // Hourly rate = Salary / Total hours
  return (salaryValue / totalHours).toFixed(2);
};

export const SalaryFormConfig = () => {
  // declare and define component state and variables
  const { userId, handleRefetchDataStatus } = useUserProfileCxt();
  const { userSalary, handleRefreshSalaryData } = useFinancialDataCxt();

  const { data: userContractData } = useUserContractData(userId ?? "");

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
            validation: [
              {
                type: "required",
                message: "الراتب الاساسي مطلوب",
              },
            ],
            onChange: async (
              newValue: any,
              values: Record<string, any>,
              formId?: string,
            ) => {
              const formStore = useFormStore.getState();

              // If type changed to constant and salary and period exist, calculate hour rate
              if (
                newValue === SalaryTypes.constants &&
                values.salary &&
                values.period_id
              ) {
                try {
                  // Get period name
                  const periodName = await getPeriodName(values.period_id);

                  // Calculate hourly rate using weekly work hours from userContractData
                  const hourlyRate = calculateHourlyRate(
                    values.period_id,
                    values.salary,
                    userContractData?.working_hours,
                    periodName,
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
            label: "مبلغ الراتب الاساسي",
            type: "text",
            placeholder: "مبلغ الراتب الاساسي",
            validation: [
              {
                type: "required",
                message: "مبلغ الراتب الاساسي مطلوب",
              },
            ],
            condition: (values) =>
              values.salary_type_code == SalaryTypes.percentage,
            postfix: "%",
            onChange: (
              newValue: any,
              values: Record<string, any>,
              formId?: string,
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
            label: "مبلغ الراتب الاساسي",
            type: "text",
            placeholder: "مبلغ الراتب الاساسي",
            validation: [
              {
                type: "required",
                message: "مبلغ الراتب الاساسي مطلوب",
              },
            ],
            condition: (values) =>
              values.salary_type_code == SalaryTypes.constants,
            postfix: "ر.س",
            onChange: async (
              newValue: any,
              values: Record<string, any>,
              formId?: string,
            ) => {
              const formStore = useFormStore.getState();

              // If we have both salary and period_id, calculate hourly rate
              if (newValue && values.period_id) {
                // Try to get the cached period name first
                let periodName = await getPeriodName(values.period_id);

                const hourlyRate = calculateHourlyRate(
                  values.period_id,
                  newValue,
                  userContractData?.working_hours,
                  periodName,
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
            onChange: async (
              newValue: any,
              values: Record<string, any>,
              formId?: string,
            ) => {
              const formStore = useFormStore.getState();
              console.log("values", values);

              // If this is for constant salary type and we have a salary value, calculate the hourly rate
              if (values.salary) {
                try {
                  // Fetch the selected period's name
                  const periodName = await getPeriodName(newValue);

                  // Calculate with the period name and weekly work hours
                  const hourlyRate = calculateHourlyRate(
                    newValue,
                    values.salary,
                    userContractData?.working_hours,
                    periodName,
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
            label: "وصف اساس حساب الراتب",
            type: "text",
            placeholder: "وصف اساس حساب الراتب",
            condition: (values) =>
              values.salary_type_code === SalaryTypes.percentage,
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
            type: "number",
            postfix: "ر.س",
            placeholder: "قيمة الساعة",
            condition: (values) =>
              values.salary_type_code === SalaryTypes.constants,
            validation: [
              {
                type: "required",
                message: "قيمة الساعة مطلوب",
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
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
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
