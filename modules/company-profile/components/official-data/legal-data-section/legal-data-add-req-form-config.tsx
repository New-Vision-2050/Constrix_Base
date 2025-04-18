import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export const LegalDataAddReqFormEditConfig = () => {
  const LegalDataAddReqFormEditConfig: FormConfig = {
    formId: "company-official-data-form",
    title: "اضافة بيان قانوني",
    apiUrl: `${baseURL}/write-the-url`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "registration_type",
            label: "نوع التسجل",
            type: "select",
            options: [{ label: "سجل تجاري", value: "سجل تجاري" }],
            validation: [
              {
                type: "required",
                message: "ادخل نوع التسجيل",
              },
            ],
          },
          {
            name: "registration_number",
            label: "ادخل رقم الترخيص",
            type: "text",
            placeholder: "ادخل رقم الترخيص",
            validation: [
              {
                type: "required",
                message: "ادخل رقم الترخيص",
              },
            ],
          },
          {
            name: "registration_start_date",
            label: "تاريخ الإصدار",
            type: "date",
            placeholder: "تاريخ الإصدار",
            validation: [
              {
                type: "required",
                message: "ادخل تاريخ الاصدار",
              },
            ],
          },
          {
            name: "registration_end_date",
            label: "تاريخ الانتهاء",
            type: "date",
            placeholder: "تاريخ الانتهاء",
            validation: [
              {
                type: "required",
                message: "ادخل تاريخ الانتهاء",
              },
            ],
          },
          {
            type: "file",
            name: "mainDocument",
            label: "اضافة مرفق",
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
      registration_type: "سجل تجاري",
      registration_number: "70025865836",
      registration_type_two: "ترخيص",
      registration_number_two: "70025865836",
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
  return LegalDataAddReqFormEditConfig;
};
