// Define the form configuration
import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";

export function getSetVacationTypeFormConfig(
  t: ReturnType<typeof useTranslations>
): FormConfig {
  return {
    formId: "vacation-types-form",
    title: t("form.title"),
    apiUrl: `${baseURL}/vacation-types-create-type`,
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
          // is_paid
          {
            name: "is_paid",
            label: t("form.isPaid"),
            type: "select",
            isMulti: true,
            placeholder: t("form.isPaidPlaceholder"),
            required: true,
            options: [
              { value: "1", label: t("paid") },
              { value: "0", label: t("notPaid") },
            ],
            validation: [
              {
                type: "required",
                message: t("form.isPaidRequired"),
              },
            ],
          },
          // is_duduct_from_balance
          {
            name: "is_duduct_from_balance",
            label: t("form.isDuduct"),
            type: "select",
            isMulti: true,
            placeholder: t("form.isDuductPlaceholder"),
            required: true,
            options: [
              { value: "1", label: t("duduct") },
              { value: "0", label: t("notDuduct") },
            ],
            validation: [
              {
                type: "required",
                message: t("form.isDuductRequired"),
              },
            ],
          },
          // conditions
          {
            name: "conditions",
            label: t("form.conditions"),
            type: "text",
            placeholder: t("form.conditionsPlaceholder"),
            required: true,
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
