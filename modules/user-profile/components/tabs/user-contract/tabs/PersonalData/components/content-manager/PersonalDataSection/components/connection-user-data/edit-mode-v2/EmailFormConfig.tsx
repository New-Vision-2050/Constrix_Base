import { FormConfig } from "@/modules/form-builder";
import { baseURL, apiClient } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";
import { useConnectionOTPCxt } from "../context/ConnectionOTPCxt";

export const EmailFormConfig = () => {
  const { userConnectionData } = usePersonalDataTabCxt();
  const { toggleMailOtpDialog } = useConnectionOTPCxt();

  const EmailFormConfig: FormConfig = {
    formId: `email-data-form`,
    title: "بيانات الاتصال",
    apiUrl: `${baseURL}/company-users/data-info`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        title: "تغيير البريد الإلكتروني",
        fields: [
          {
            name: "email",
            label: "البريد الإلكتروني",
            type: "email",
            placeholder: "البريد الإلكتروني",
            validation: [
              {
                type: "required",
                message: "البريد الإلكتروني مطلوب",
              },
              {
                type: "email",
                message: "برجاء أدخل بريد إلكتروني صحيح",
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
    submitButtonText: "تغيير البريد الإلكتروني",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "إلغاء",
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
