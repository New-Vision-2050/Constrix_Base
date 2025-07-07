import { FormConfig } from "@/modules/form-builder";
import { baseURL, apiClient } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";
import { useConnectionOTPCxt } from "../context/ConnectionOTPCxt";
import { useTranslations } from "next-intl";

export const ConnnectionFormConfig = () => {
  const { userConnectionData } = usePersonalDataTabCxt();
  const { togglePhoneOtpDialog } = useConnectionOTPCxt();
  const t = useTranslations("UserProfile.tabs.ConnectionDataSection");

  const PersonalFormConfig: FormConfig = {
    formId: `connection-data-form`,
    title: t("title"),
    apiUrl: `${baseURL}/company-users/data-info`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        title: t("changePhone"),
        fields: [
          {
            name: "phone",
            label: t("phoneNumber"),
            type: "phone",
            placeholder: t("phoneNumber"),
            validation: [
              {
                type: "required",
                message: t("phoneRequired"),
              },
              {
                type: "phone",
                message: t("validPhoneRequired"),
              },
            ],
          }
        ],
        columns: 2,
      },
    ],
    initialValues: {
      phone: userConnectionData?.phone,
    },
    submitButtonText: t("changePhone"),
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
        // Send OTP to mobile
        const body = {
          identifier: formData.phone,
          type: "phone",
        };
        
        await apiClient.post(`/company-users/send-otp`, body);
        
        // Open OTP dialog
        togglePhoneOtpDialog();
        
        return {
          success: true,
          message: t("otpSentToPhone"),
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
  return PersonalFormConfig;
};
