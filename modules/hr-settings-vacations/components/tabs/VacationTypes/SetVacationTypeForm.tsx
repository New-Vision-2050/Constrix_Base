// Define the form configuration
import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";

export function getSetVacationTypeFormConfig(
  t: ReturnType<typeof useTranslations>,
  onSuccessFn: () => void
): FormConfig {
  return {
    formId: "vacation-types-form",
    title: t("form.title"),
    apiUrl: `${baseURL}/leave-types`,
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
          // is_payed
          {
            name: "is_payed",
            label: t("form.isPaid"),
            type: "select",
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
          // is_deduct_from_balance
          {
            name: "is_deduct_from_balance",
            label: t("form.isDuduct"),
            type: "select",
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
          },
        ],
      },
    ],
    editDataTransformer: (data) => {
      console.log("editDataTransformer", data);
      data.is_deduct_from_balance = Boolean(data.is_deduct_from_balance)
        ? "1"
        : "0";
      data.is_payed = Boolean(data.is_payed) ? "1" : "0";
      return data;
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
