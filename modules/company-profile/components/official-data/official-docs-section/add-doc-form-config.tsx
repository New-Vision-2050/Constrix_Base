import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import useCompanyStore from "../../../store/useCompanyOfficialData";

export const AddDocFormConfig = () => {
  const { company } = useCompanyStore();
  const AddDocFormConfig: FormConfig = {
    formId: "AddDocFormConfig",
    apiUrl: `${baseURL}/write-the-url`,
    title: "اضافة مستند رسمي",
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "doc_type",
            label: "نوع المستند",
            type: "select",
            options: [{ label: "سجل تجاري", value: "سجل تجاري" }],
            validation: [
              {
                type: "required",
                message: "ادخل نوع المستند",
              },
            ],
          },
          {
            name: "desc",
            label: "الوصف",
            type: "text",
            placeholder: "ادخل الوصف",
          },
          {
            name: "number",
            label: "رقم المستند",
            type: "text",
            placeholder: "ادخل رقم المستند",
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
            name: "registration_notification_date",
            label: "تاريخ الاشعار",
            type: "date",
            placeholder: "تاريخ الاشعار",
            validation: [
              {
                type: "required",
                message: "ادخل تاريخ الاشعار",
              },
            ],
          },
          {
            type: "file",
            name: "mainDocument",
            label: "اضافة مستندات",
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
  return AddDocFormConfig;
};
