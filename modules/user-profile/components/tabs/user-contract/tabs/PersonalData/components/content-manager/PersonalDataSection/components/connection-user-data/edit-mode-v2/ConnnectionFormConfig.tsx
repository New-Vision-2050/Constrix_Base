import { FormConfig } from "@/modules/form-builder";
import { baseURL, apiClient } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";
import { useConnectionOTPCxt } from "../context/ConnectionOTPCxt";
import { useTranslations } from "next-intl";

export const ConnnectionFormConfig = () => {
  const t = useTranslations("UserProfile.nestedTabs.connectionData");
  const { userConnectionData } = usePersonalDataTabCxt();
  const { togglePhoneOtpDialog } = useConnectionOTPCxt();

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
        title:t("changePhone"),
        fields: [
          {
            name: "phone",
            label: t("phone"),
            type: "phone",
            placeholder: t("phone"),
            validation: [
              {
                type: "required",
                message: t("phoneRequired"),
              },
              {
                type: "phone",
                message: t("phoneInvalid"),
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
          message: "تم إرسال رمز التحقق إلى رقم الجوال",
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
  return PersonalFormConfig;
};
