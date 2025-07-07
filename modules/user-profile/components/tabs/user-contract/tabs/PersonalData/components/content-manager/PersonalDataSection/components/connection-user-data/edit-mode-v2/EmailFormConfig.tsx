import { FormConfig } from "@/modules/form-builder";
import { baseURL, apiClient } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";
import { useConnectionOTPCxt } from "../context/ConnectionOTPCxt";
import { useTranslations } from "next-intl";

export const EmailFormConfig = () => {
  const { userConnectionData } = usePersonalDataTabCxt();
  const { toggleMailOtpDialog } = useConnectionOTPCxt();
  const t = useTranslations("UserProfile.tabs.ConnectionDataSection");

  const EmailFormConfig: FormConfig = {
    formId: `email-data-form`,
    title: t("title"),
    apiUrl: `${baseURL}/company-users/data-info`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        title: t("changeEmail"),
        fields: [
          {
            name: "email",
            label: t("email"),
            type: "email",
            placeholder: t("email"),
            validation: [
              {
                type: "required",
                message: t("emailRequired"),
              },
              {
                type: "email",
                message: t("validEmailRequired"),
              },
            ],
          }
        ],
        columns: 2,
      },
    ],
    initialValues: {
      email: userConnectionData?.email,
    },
    submitButtonText: t("changeEmail"),
    cancelButtonText: t("cancel"),
    showReset: false,
    resetButtonText: t("cancel"),
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSuccess: () => {},
    onSubmit: async (formData: Record<string, unknown>) => {
      console.log("formData", formData);
      
      try {
        // Send OTP to email
        const body = {
          identifier: formData.email,
          type: "email",
        };
        
        await apiClient.post(`/company-users/send-otp`, body);
        
        // Open OTP dialog
        toggleMailOtpDialog();
        
        return {
          success: true,
          message: t("otpSentToEmail"),
        };
      } catch (error) {
        console.log("error", error);
        return {
          success: false,
          message: t("otpSendError"),
        };
      }
    },
  };
  return EmailFormConfig;
};
