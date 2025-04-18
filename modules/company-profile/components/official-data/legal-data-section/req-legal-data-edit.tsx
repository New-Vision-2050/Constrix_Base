import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import useCompanyStore from "../../../store/useCompanyOfficialData";

export const ReqLegalDataEdit = () => {
  const ReqLegalDataEdit: FormConfig = {
    formId: "ReqOfficialDataEdit",
    title: "طلب تعديل البيانات الرسمية",
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            type: "select",
            name: "country_id",
            label: "دولة المركز الرئيسي",
            placeholder: "اختر دولة المركز الرئيسي",
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
            validation: [
              {
                type: "required",
                message: "ادخل دولة المركز الرئيسي",
              },
            ],
          },
          {
            name: "company_type",
            label: "كيان الشركة",
            type: "select",
            options: [{ label: "هندسي", value: "هندسي" }],
            validation: [
              {
                type: "required",
                message: "ادخل كيان الشركة",
              },
            ],
          },
          {
            name: "company_field",
            label: "مجال الشركة",
            type: "select",
            options: [{ label: "استشارات هندسية", value: "استشارات هندسية" }],
            validation: [
              {
                type: "required",
                message: "ادخل مجال الشركة",
              },
            ],
          },
          {
            name: "name",
            label: "اسم الشركة",
            type: "text",
            placeholder: "اسم الشركة",
            validation: [
              {
                type: "required",
                message: "اسم الشركة مطلوب",
              },
            ],
          },
          {
            name: "bucket",
            label: "الباقة",
            type: "select",
            options: [{ label: "متميز", value: "متميز" }],
            validation: [
              {
                type: "required",
                message: "الباقة مطلوبة",
              },
            ],
          },
          {
            name: "notes",
            label: "ملاحظات",
            type: "text",
            placeholder: "ملاحظات",
          },
          {
            type: "file",
            name: "mainDocument",
            label: "Main Document",
            required: true,
            validation: [
              {
                type: "required",
                message: "Main document is required",
              },
            ],
            isMulti: true,
            fileConfig: {
              allowedFileTypes: [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              ],
              maxFileSize: 5 * 1024 * 1024, // 10MB
              showThumbnails: true,
              // If you have an upload endpoint, you can specify it here
              // uploadUrl: "/api/upload-file",
              // uploadHeaders: {
              //   Authorization: "Bearer your-token",
              // },
            },
          },
        ],
      },
    ],
    initialValues: {
      name: "",
      branch: "",
      name_en: "",
      company_type: "هندسي",
    },
    submitButtonText: "ارسال طلب التعديل",
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
  return ReqLegalDataEdit;
};
