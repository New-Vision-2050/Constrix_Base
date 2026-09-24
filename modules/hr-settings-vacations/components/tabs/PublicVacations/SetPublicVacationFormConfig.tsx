import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { toMonthDay } from "@/modules/hr-settings-vacations/utils/holiday-dates";
import HolidayDaysCountField from "./HolidayDaysCountField";

type FormOptions = {
  branchId?: string | number | null;
  year?: number;
  isEdit?: boolean;
};

export function getSetPublicVacationFormConfig(
  t: ReturnType<typeof useTranslations>,
  onSuccessFn?: () => void,
  options?: FormOptions
): FormConfig {
  const currentYear = options?.year ?? new Date().getFullYear();
  const formId = options?.isEdit
    ? "public-vacations-form"
    : "public-vacations-add-form";
  const branchIdValue =
    options?.branchId != null ? String(options.branchId) : "";

  return {
    formId,
    title: options?.isEdit ? t("form.editTitle") : t("form.title"),
    apiUrl: `${baseURL}/public-holidays`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    initialValues: {
      name: "",
      date_start: "",
      date_end: "",
      branch_id: branchIdValue,
    },
    resetOnOpen: !options?.isEdit,
    sections: [
      {
        fields: [
          {
            type: "text",
            name: "name",
            label: t("form.name"),
            placeholder: t("form.namePlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("form.nameRequired"),
              },
            ],
          },
          {
            type: "text",
            name: "branch_id",
            label: "branch_id",
            hidden: true,
            defaultValue: branchIdValue,
          },
          {
            name: "date_start",
            label: t("form.startDate"),
            type: "date",
            placeholder: t("form.startDatePlaceholder"),
            required: true,
            fixedYear: true,
            validation: [
              {
                type: "required",
                message: t("form.startDateRequired"),
              },
            ],
          },
          {
            name: "date_end",
            label: t("form.endDate"),
            type: "date",
            placeholder: t("form.endDatePlaceholder"),
            required: true,
            fixedYear: true,
            validation: [
              {
                type: "required",
                message: t("form.endDateRequired"),
              },
            ],
          },
          {
            type: "text",
            name: "holiday_days_count_display",
            label: t("daysCount"),
            render: () => (
              <HolidayDaysCountField
                formId={formId}
                label={t("daysCount")}
                year={currentYear}
              />
            ),
          },
        ],
      },
    ],
    onSubmit: async (formData: any) => {
      const newFormData = {
        name: formData.name,
        branch_id: formData.branch_id || options?.branchId,
        date_start: toMonthDay(formData.date_start) || formData.date_start,
        date_end: toMonthDay(formData.date_end) || formData.date_end,
      };
      return await defaultSubmitHandler(
        newFormData,
        getSetPublicVacationFormConfig(t, onSuccessFn, options)
      );
    },
    onSuccess: onSuccessFn,
    submitButtonText: t("form.submitButtonText"),
    cancelButtonText: t("form.cancelButtonText"),
    showReset: false,
    resetButtonText: t("form.resetButtonText"),
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,
  };
}
