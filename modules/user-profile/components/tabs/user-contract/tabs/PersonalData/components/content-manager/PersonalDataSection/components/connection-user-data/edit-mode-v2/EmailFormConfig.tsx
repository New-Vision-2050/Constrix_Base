import { FormConfig } from "@/modules/form-builder";
import { baseURL, apiClient } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";
import { useConnectionOTPCxt } from "../context/ConnectionOTPCxt";
import { useTranslations } from "next-intl";

export const EmailFormConfig = () => {
  const t = useTranslations("UserProfile.nestedTabs.connectionData");
  const { userConnectionData } = usePersonalDataTabCxt();
  const { toggleMailOtpDialog } = useConnectionOTPCxt();

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
                message: t("emailInvalid"),
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
          message: "تم إرسال رمز التحقق إلى البريد الإلكتروني",
        };
      } catch (error) {
        console.log("error", error);
        return {
          success: false,
          message: "حدث خطأ أثناء إرسال رمز التحقق",
        };
      }
    },
  };
  return EmailFormConfig;
};
