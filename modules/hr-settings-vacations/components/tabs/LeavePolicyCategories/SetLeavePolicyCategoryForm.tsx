import { FormConfig } from "@/modules/form-builder";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import { OutlinedTextField } from "../../shared/OutlinedFields";

const FORM_ID = "leave-policy-category-form";

export function getSetLeavePolicyCategoryFormConfig(
  t: ReturnType<typeof useTranslations>,
  onSuccessFn: () => void
): FormConfig {
  return {
    formId: FORM_ID,
    title: t("form.title"),
    apiUrl: `${baseURL}/leave-policy-categories`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    initialValues: { name: "" },
    subWrapperParentClassName:
      "!border-0 !rounded-none !mb-0 !bg-transparent !shadow-none",
    subWrapperClassName: "!bg-transparent !p-0",
    sections: [
      {
        collapsible: false,
        fields: [
          {
            type: "text",
            name: "name",
            label: t("form.name"),
            placeholder: t("form.namePlaceholder"),
            required: true,
            validation: [
              { type: "required", message: t("form.nameRequired") },
              { type: "maxLength", value: 255, message: t("form.nameMaxLength") },
            ],
            render: (_field, value, onChange) => (
              <OutlinedTextField
                formId={FORM_ID}
                name="name"
                heading={t("form.data")}
                label={t("form.name")}
                placeholder={t("form.namePlaceholder")}
                value={String(value ?? "")}
                onChange={onChange}
                required
              />
            ),
          },
        ],
      },
    ],
    editDataTransformer: (data) => ({
      id: data.id,
      name: data.name,
    }),
    onSubmit: async (values, formConfig) =>
      defaultSubmitHandler(
        { ...(values.id ? { id: values.id } : {}), name: values.name },
        formConfig
      ),
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
