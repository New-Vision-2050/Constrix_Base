// Define the form configuration
import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

export const MailProviderConfig = (id: string) => {
  const canUpdate = can(PERMISSION_ACTIONS.UPDATE, PERMISSION_SUBJECTS.DRIVER) as boolean;

  const MailFormConfig: FormConfig = {
    formId: "mail-provider-form",
    title: "",
    apiUrl: `${baseURL}/settings/driver/${id}`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        title: "",
        fields: [
          {
            name: "MAIL_DRIVER",
            label: "Mail DRIVER",
            type: "text",
            placeholder: "Mail DRIVER",
          },
          {
            name: "MAIL_ENCRYPTION",
            label: "Mail ENCRYPTION",
            type: "text",
            placeholder: "Mail ENCRYPTION",
          },
          {
            name: "MAIL_FROM_ADDRESS",
            label: "Mail From Address",
            type: "text",
            placeholder: "Mail From Address",
          },
          {
            name: "MAIL_FROM_NAME",
            label: "Mail From Name",
            type: "text",
            placeholder: "Mail From Name",
          },
          {
            name: "MAIL_MAILER",
            label: "Mail Mailer",
            type: "text",
            placeholder: "Mail Mailer",
          },
          {
            name: "MAIL_HOST",
            label: "Mail Host",
            type: "text",
            placeholder: "Mail Host",
          },
          {
            name: "MAIL_PORT",
            label: "Mail Port",
            type: "text",
            placeholder: "Mail Port",
          },
          {
            name: "MAIL_PASSWORD",
            label: "Mail Password",
            type: "text",
            placeholder: "Mail Password",
          },
          {
            name: "MAIL_USERNAME",
            label: "Mail UserName",
            type: "text",
            placeholder: "Mail UserName",
          },
        ],
      },
    ],
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,
    disableSubmitButton: canUpdate,

    // Example onSuccess handler
    onSuccess: (values, result) => {
      console.log("Form submitted successfully with values:", values);
      console.log("Result from API:", result);
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const body = {
        config: {
          ...formData,
        },
      };
      const response = await apiClient.put(
        `${baseURL}/settings/driver/${id}`,
        body
      );

      return {
        success: true,
        message: response.data?.message || "Form submitted successfully",
        data: response.data || {},
      };
    },
    // Example onError handler
    onError: (values, error) => {
      console.log("Form submission failed with values:", values);
      console.log("Error details:", error);
    },
  };
  return MailFormConfig;
};
