// Define the form configuration
import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import {
  OutlinedSelectField,
  OutlinedTextField,
  SwitchRowField,
} from "../../shared/OutlinedFields";

const FORM_ID = "vacation-types-form";

export function getSetVacationTypeFormConfig(
  t: ReturnType<typeof useTranslations>,
  onSuccessFn: () => void
): FormConfig {
  const paidOptions = [
    { value: "1", label: t("paid") },
    { value: "0", label: t("notPaid") },
  ];
  const deductOptions = [
    { value: "1", label: t("duduct") },
    { value: "0", label: t("form.withoutBalance") },
  ];

  return {
    formId: FORM_ID,
    title: t("form.title"),
    apiUrl: `${baseURL}/leave-types`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    initialValues: {
      requires_attachment: false,
    },
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
              {
                type: "required",
                message: t("form.nameRequired"),
              },
            ],
            render: (_field, value, onChange) => (
              <OutlinedTextField
                formId={FORM_ID}
                name="name"
                heading={t("form.typeData")}
                label={t("form.name")}
                placeholder={t("form.namePlaceholder")}
                value={String(value ?? "")}
                onChange={onChange}
                required
              />
            ),
          },
          {
            name: "is_payed",
            label: t("form.isPaid"),
            type: "select",
            placeholder: t("form.isPaidPlaceholder"),
            required: true,
            options: paidOptions,
            validation: [
              {
                type: "required",
                message: t("form.isPaidRequired"),
              },
            ],
            render: (_field, value, onChange) => (
              <OutlinedSelectField
                formId={FORM_ID}
                name="is_payed"
                label={t("form.isPaid")}
                placeholder={t("form.isPaidPlaceholder")}
                value={String(value ?? "")}
                onChange={onChange}
                options={paidOptions}
              />
            ),
          },
          {
            name: "is_deduct_from_balance",
            label: t("form.isDuduct"),
            type: "select",
            placeholder: t("form.isDuductPlaceholder"),
            required: true,
            options: deductOptions,
            validation: [
              {
                type: "required",
                message: t("form.isDuductRequired"),
              },
            ],
            render: (_field, value, onChange) => (
              <OutlinedSelectField
                formId={FORM_ID}
                name="is_deduct_from_balance"
                label={t("form.isDuduct")}
                placeholder={t("form.isDuductPlaceholder")}
                value={String(value ?? "")}
                onChange={onChange}
                options={deductOptions}
              />
            ),
          },
          {
            name: "requires_attachment",
            label: t("form.requiresAttachment"),
            type: "checkbox",
            render: (_field, value, onChange) => (
              <SwitchRowField
                heading={t("form.requestAndApproval")}
                label={t("form.requiresAttachment")}
                value={Boolean(value)}
                onChange={onChange}
              />
            ),
          },
        ],
      },
    ],
    editDataTransformer: (data) => {
      data.is_deduct_from_balance = Boolean(data.is_deduct_from_balance)
        ? "1"
        : "0";
      data.is_payed = Boolean(data.is_payed) ? "1" : "0";
      data.requires_attachment = Boolean(data.requires_attachment);
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
