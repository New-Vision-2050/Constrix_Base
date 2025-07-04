import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";

export const ConnnectionFormConfig = () => {
  const { userConnectionData } = usePersonalDataTabCxt();

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
          },
          {
            name: "email",
            label: "البريد الألكتروني",
            type: "email",
            placeholder: "البريد الألكتروني",
            validation: [
              {
                type: "required",
                message: "البريد الألكتروني مطلوب",
              },
              {
                type: "email",
                message: "برجاء أدخل بريد إلكتروني صحيح",
              },
            ],
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      phone: userConnectionData?.phone,
      email: userConnectionData?.email,
    },
    submitButtonText: "حفظ",
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

      return {
        success: true,
        message: "تم تحديث البيانات بنجاح",
      };
    },
  };
  return PersonalFormConfig;
};
