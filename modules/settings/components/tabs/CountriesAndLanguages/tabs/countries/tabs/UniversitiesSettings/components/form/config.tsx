import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export const universityFormConfig: FormConfig = {
  formId: "university-form",
  title: "إضافة جامعة",
  apiUrl: `${baseURL}/universities`,
  laravelValidation: {
    enabled: true,
    errorsPath: "errors",
  },
  sections: [
    {
      fields: [
        {
          name: "name",
          label: "اسم الجامعة",
          type: "text",
          placeholder: "برجاء إدخال اسم الجامعة",
          validation: [{ type: "required", message: "اسم الجامعة مطلوب" }],
        },
        {
          name: "country_id",
          label: "الدولة",
          type: "select",
          placeholder: "اختر الدولة",
          dynamicOptions: {
            url: `${baseURL}/countries`,
            valueField: "id",
            labelField: "name",
            searchParam: "name",
            paginationEnabled: true,
            pageParam: "page",
            limitParam: "per_page",
            itemsPerPage: 10,
            totalCountHeader: "X-Total-Count",
          },
          validation: [{ type: "required", message: "الدولة مطلوبة" }],
        },
        {
          name: "url",
          label: "الرابط",
          type: "text",
          placeholder: "برجاء إدخال رابط الجامعة",
        },
      ],
    },
  ],
  submitButtonText: "حفظ",
  cancelButtonText: "إلغاء",
  showReset: false,
  showSubmitLoader: true,
  resetOnSuccess: true,
  showCancelButton: false,
  showBackButton: false,
};
