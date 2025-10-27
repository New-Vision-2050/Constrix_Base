// Define the form configuration
import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

export function getSetPublicVacationFormConfig(
  t: ReturnType<typeof useTranslations>,
  onSuccessFn?: () => void
): FormConfig {
  return {
    formId: "public-vacations-form",
    title: t("form.title"),
    apiUrl: `${baseURL}/public-holidays`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors", // This is the default in Laravel
    },
    sections: [
      {
        fields: [
          // name
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
          // country
          {
            type: "select",
            name: "country_id",
            label:t("form.country"),
            placeholder: t("form.countryPlaceholder"),
            required: true,
            dynamicOptions: {
              url: `${baseURL}/countries`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 1000,
              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: t("form.countryRequired"),
              },
            ],
          },
          // start_date
          {
            name: "date_start",
            label: t("form.startDate"),
            type: "date",
            placeholder: t("form.startDatePlaceholder"),
            required: true,
            maxDate: {
              formId: "public-vacations-form",
              field: "date_end",
            },
            validation: [
              {
                type: "required",
                message: t("form.startDateRequired"),
              },
            ],
          },
          // end_date
          {
            name: "date_end",
            label: t("form.endDate"),
            type: "date",
            placeholder: t("form.endDatePlaceholder"),
            required: true,
            minDate: {
              formId: "public-vacations-form",
              field: "date_start",
            },
            validation: [
              {
                type: "required",
                message: t("form.endDateRequired"),
              },
            ],
          }
        ],
      }
    ],
    onSubmit: async (formData: any) => {
      const newFormData = {
        ...formData,
        date_start: new Date(formData.date_start).toISOString().split("T")[0],
        date_end: new Date(formData.date_end).toISOString().split("T")[0],
      };
      // const url
      return await defaultSubmitHandler(newFormData, getSetPublicVacationFormConfig(t));
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
