import { FormConfig } from "@/modules/form-builder";
import { baseURL, apiClient } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";
import { useConnectionOTPCxt } from "../context/ConnectionOTPCxt";
import { useTranslations } from "next-intl";

export const EmailFormConfig = () => {
  const t = useTranslations("UserProfile.nestedTabs.connectionData");
  const { userConnectionData } = usePersonalDataTabCxt();
  const { toggleMailOtpDialog, setMailOtpIdentifier } = useConnectionOTPCxt();

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
            name: "oldEmail",
            label: t("oldEmail"),
            type: "email",
            placeholder: t("oldEmail"),
            disabled: true,
          },
          {
            name: "newEmail",
            label: t("newEmail"),
            type: "email",
            placeholder: t("newEmail"),
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
      oldEmail: userConnectionData?.email,
      newEmail: "",
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
          identifier: formData.newEmail,
          type: "email",
        };
        
        await apiClient.post(`/company-users/send-otp`, body);
        
        // Set the identifier for OTP verification
        setMailOtpIdentifier(formData.newEmail as string);
        
        // Open OTP dialog
        toggleMailOtpDialog();
        
        return {
          success: true,
          message: t("verificationCodeSent"),
        };
      } catch (error) {
        console.log("error", error);
        return {
          success: false,
          message: t("verificationCodeError"),
        };
      }
    },
  };
  return EmailFormConfig;
};
