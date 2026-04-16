import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient, baseURL } from "@/config/axios-config";
import { FormConfig, useFormStore } from "@/modules/form-builder";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useTranslations } from "next-intl";
import { useFinancialDataCxt } from "../../context/financialDataCxt";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { SalaryTypes } from "./salary_type_enum";
import useUserContractData from "../../../FunctionalAndContractualData/hooks/useUserContractData";

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
  const t = useTranslations("common");
  const tActions = useTranslations("UserProfile.nestedTabs.commonActions");
  const tSalary = useTranslations("UserProfile.nestedTabs.basicSalaryEdit");
  const { userId, handleRefetchDataStatus } = useUserProfileCxt();
  const { userSalary, handleRefreshSalaryData } = useFinancialDataCxt();

  const { data: userContractData } = useUserContractData(userId ?? "");

  const { data: periodsData } = useQuery({
    queryKey: ["periods"],
    queryFn: async () => {
      const response = await apiClient.get(`${baseURL}/periods`);
      return response.data.payload as { id: string; name: string }[];
    },
  });

  const periodNameMap = useMemo(() => {
    const map = new Map<string, string>();
    periodsData?.forEach((period) => map.set(period.id, period.name));
    return map;
  }, [periodsData]);

  useEffect(() => {
    const formStore = useFormStore.getState();
    const values = formStore.getValues("salary-data-form");
    if (
      values?.salary_type_code !== SalaryTypes.constants ||
      !values?.salary ||
      !values?.period_id ||
      !userContractData?.working_hours ||
      !periodNameMap.size
    )
      return;

    const periodName = periodNameMap.get(values.period_id);
    if (!periodName) return;

    const hourlyRate = calculateHourlyRate(
      values.period_id,
      values.salary,
      userContractData.working_hours,
      periodName,
    );

    formStore.setValues("salary-data-form", { hour_rate: hourlyRate });
  }, [userContractData?.working_hours, periodNameMap]);

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
            label: tSalary("basicSalary"),
            type: "select",
            placeholder: tSalary("placeholders.basicSalary"),
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
                message: tSalary("validation.basicSalaryRequired"),
              },
            ],
            onChange: (newValue: any, values: Record<string, any>) => {
              const formStore = useFormStore.getState();

              if (
                newValue === SalaryTypes.constants &&
                values.salary &&
                values.period_id
              ) {
                const periodName = periodNameMap.get(values.period_id);
                const hourlyRate = calculateHourlyRate(
                  values.period_id,
                  values.salary,
                  userContractData?.working_hours,
                  periodName,
                );
                formStore.setValues("salary-data-form", {
                  hour_rate: hourlyRate,
                });
              } else if (newValue !== SalaryTypes.constants) {
                formStore.setValues("salary-data-form", { hour_rate: "" });
              }
            },
          },
          {
            name: "salary",
            label: tSalary("basicSalaryAmount"),
            type: "text",
            placeholder: tSalary("placeholders.basicSalaryAmount"),
            validation: [
              {
                type: "required",
                message: tSalary("validation.basicSalaryAmountRequired"),
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
            label: tSalary("basicSalaryAmount"),
            type: "text",
            placeholder: tSalary("placeholders.basicSalaryAmount"),
            validation: [
              {
                type: "required",
                message: tSalary("validation.basicSalaryAmountRequired"),
              },
            ],
            condition: (values) =>
              values.salary_type_code == SalaryTypes.constants,
            postfix: "ر.س",
            onChange: (newValue: any, values: Record<string, any>) => {
              const formStore = useFormStore.getState();

              if (newValue && values.period_id) {
                const periodName = periodNameMap.get(values.period_id);
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
                formStore.setValues("salary-data-form", { hour_rate: "" });
              }
            },
          },
          {
            type: "select",
            name: "period_id",
            label: tSalary("paymentCycle"),
            placeholder: tSalary("placeholders.paymentCycle"),
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
                message: tSalary("validation.paymentCycleRequired"),
              },
            ],
            onChange: (newValue: any, values: Record<string, any>) => {
              const formStore = useFormStore.getState();

              if (values.salary) {
                const periodName = periodNameMap.get(newValue);
                const hourlyRate = calculateHourlyRate(
                  newValue,
                  values.salary,
                  userContractData?.working_hours,
                  periodName,
                );
                formStore.setValues("salary-data-form", {
                  hour_rate: hourlyRate,
                });
              } else {
                formStore.setValues("salary-data-form", { hour_rate: "" });
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
            label: tSalary("hourlyRate"),
            type: "number",
            postfix: "ر.س",
            placeholder: tSalary("placeholders.hourlyRate"),
            condition: (values) =>
              values.salary_type_code === SalaryTypes.constants,
            validation: [
              {
                type: "required",
                message: tSalary("validation.hourlyRateRequired"),
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
    submitButtonText: t("save"),
    cancelButtonText: t("cancel"),
    showReset: false,
    resetButtonText: tActions("clearForm"),
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
