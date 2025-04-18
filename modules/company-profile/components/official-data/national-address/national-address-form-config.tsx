import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export const NationalAddressFormConfig = () => {
  const NationalAddressFormConfig: FormConfig = {
    formId: "company-official-data-form",
    title: "اضافة بيان قانوني",
    apiUrl: `${baseURL}/write-the-url`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        columns: 2,
        fields: [
          {
            name: "name",
            label: "الدولة",
            type: "text",
            placeholder: "اسم الشركة",
            disabled: true,
          },
          {
            name: "area",
            label: "المنطقة",
            type: "text",
            placeholder: "المنطقة",
          },
          {
            name: "city",
            label: "المدينة",
            type: "text",
            placeholder: "المدينة",
          },
          {
            name: "state",
            label: "الحي",
            type: "text",
            placeholder: "الحي",
          },
          {
            name: "build",
            label: "رقم المبنى",
            type: "text",
            placeholder: "رقم المبنى",
          },
          {
            name: "phone",
            label: "الرقم الاضافي",
            type: "text",
            placeholder: "الرقم الاضافي",
          },
          {
            name: "zip",
            label: "الرمز البريدي",
            type: "text",
            placeholder: "الرمز البريدي",
          },
          {
            name: "street",
            label: "الشارع",
            type: "text",
            placeholder: "الشارع",
          },
          {
            name: "map",
            label: "",
            type: "text",
            placeholder: "تعديل الموقع من الخريطة",
            disabled: true,
            gridArea: 2,
          },
        ],
      },
    ],
    initialValues: {
      name: "المملكة العربية السعودية",
      area: "الشمالية",
      city: "الرياض",
      state: "المحمدية",
      build: "256",
      phone: "966548552355",
      zip: "052",
      street: "شارع الصفا - مبنى 257",
    },
    submitButtonText: "Submit",
    cancelButtonText: "Cancel",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSubmit: async (formData: Record<string, unknown>) => {
      return {
        success: true,
        message: "dummy return",
        data: {},
      };
    },
  };
  return NationalAddressFormConfig;
};
