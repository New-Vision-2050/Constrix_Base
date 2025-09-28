// Define the form configuration
import React from "react";
import { useTranslations } from "next-intl";
import { baseURL } from "@/config/axios-config";
import { FormConfig, useFormStore } from "@/modules/form-builder";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { NotifySettings } from "./apis/get-notify-settings";

export function getNotifySettingsFormConfig(
  notifySettings: NotifySettings | undefined,
  t: ReturnType<typeof useTranslations>,
  onSuccessFn: () => void
): FormConfig {
  const formId = "notify-settings-form";

  return {
    formId,
    apiUrl: `${baseURL}/notification_settings`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors", // This is the default in Laravel
    },
    initialValues: {
      type: notifySettings?.type || "",
      email: notifySettings?.email || "",
      phone: notifySettings?.phone || "",
      reminder_type: notifySettings?.reminder_type || "",
      message: notifySettings?.message || "",
    },
    sections: [
      {
        fields: [
          // type
          {
            name: "type",
            label: t("form.type"),
            type: "select",
            placeholder: t("form.typePlaceholder"),
            options: [
              { value: "mail", label: t("form.email") },
              { value: "sms", label: t("form.sms") },
              { value: "both", label: t("form.both") },
            ],
          },
          // email
          {
            name: "email",
            label: t("form.email"),
            type: "email",
            placeholder: t("form.emailPlaceholder"),
            validation: [
              {
                type: "email",
                message: t("form.emailInvalid"),
              },
            ],
            condition: (values) =>
              values.type === "mail" || values.type === "both",
          },
          // phone
          {
            name: "phone",
            label: t("form.phone"),
            type: "phone",
            placeholder: t("form.phonePlaceholder"),
            validation: [
              {
                type: "phone",
                message: t("form.phoneInvalid"),
              },
            ],
            condition: (values) =>
              values.type === "sms" || values.type === "both",
          },
          // reminder type
          {
            name: "reminder_type",
            label: t("form.reminder_type"),
            type: "radio",
            placeholder: t("form.reminder_typePlaceholder"),
            options: [
              { value: "daily", label: t("form.daily") },
              { value: "weekly", label: t("form.weekly") },
            ],
          },
          // message
          {
            name: "message",
            label: t("form.message"),
            type: "textarea",
            placeholder: t("form.messagePlaceholder"),
          },
        ],
      },
    ],
    // editDataTransformer: (data) => {},
    onSuccess: onSuccessFn,
    onSubmit: async (formData) => {
      return await defaultSubmitHandler(
        formData,
        getNotifySettingsFormConfig(notifySettings, t, onSuccessFn)
      );
    },
    submitButtonText: t("form.submitButtonText"),
    showSubmitLoader: true,
  };
}
