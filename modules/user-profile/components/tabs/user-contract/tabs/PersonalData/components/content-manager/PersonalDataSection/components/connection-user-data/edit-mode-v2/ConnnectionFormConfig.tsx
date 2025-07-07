import { FormConfig } from "@/modules/form-builder";
import { baseURL, apiClient } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";
import { useConnectionOTPCxt } from "../context/ConnectionOTPCxt";

export const ConnnectionFormConfig = () => {
  const { userConnectionData } = usePersonalDataTabCxt();
  const { togglePhoneOtpDialog } = useConnectionOTPCxt();

  const PersonalFormConfig: FormConfig = {
    formId: `connection-data-form`,
    title: "بيانات الاتصال",
    apiUrl: `${baseURL}/company-users/data-info`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        title:"تغيير رقم الجوال",
        fields: [
          {
            name: "phone",
            label: "رقم الجوال",
            type: "phone",
            placeholder: "رقم الجوال",
            validation: [
              {
                type: "required",
                message: "رقم الجوال مطلوب",
              },
              {
                type: "phone",
                message: "برجاء أدخل رقم جوال صحيح",
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
    submitButtonText: "تغيير رقم الجوال",
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
