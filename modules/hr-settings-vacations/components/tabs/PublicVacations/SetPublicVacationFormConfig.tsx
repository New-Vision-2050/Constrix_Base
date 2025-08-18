// Define the form configuration
import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";

export function getSetPublicVacationFormConfig(
  t: ReturnType<typeof useTranslations>
): FormConfig {
  return {
    formId: "public-vacations-form",
    title: t("form.title"),
    apiUrl: `${baseURL}/public-vacations-create-type`,
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
            name: "start_date",
            label: t("form.startDate"),
            type: "date",
            placeholder: t("form.startDatePlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("form.startDateRequired"),
              },
            ],
          },
          // end_date
          {
            name: "end_date",
            label: t("form.endDate"),
            type: "date",
            placeholder: t("form.endDatePlaceholder"),
            required: true,
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
