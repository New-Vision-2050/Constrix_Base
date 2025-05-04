import { apiClient, baseURL } from "@/config/axios-config";
import { FormConfig } from "@/modules/form-builder";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useQueryClient } from "@tanstack/react-query";
import { serialize } from "object-to-formdata";

export const AddDocFormConfig = (id?: string) => {
  const queryClient = useQueryClient();

  const AddDocFormConfig: FormConfig = {
    formId: `AddDocFormConfig-${id}`,
    title: "اضافة مستند رسمي",
    apiUrl: `${baseURL}/companies/company-profile/official-document`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            type: "select",
            name: "document_type_id",
            label: "نوع المستند",
            placeholder: "نوع المستند",
            dynamicOptions: {
              url: `${baseURL}/company_registration_types`,
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
                message: "ادخل نوع المستند",
              },
            ],
          },
          {
            name: "description",
            label: "الوصف",
            type: "text",
            placeholder: "ادخل الوصف",
            validation: [
              {
                type: "required",
                message: "ادخل الوصف",
              },
            ],
          },
          {
            name: "document_number",
            label: "رقم المستند",
            type: "text",
            placeholder: "ادخل رقم المستند",
            validation: [
              {
                type: "required",
                message: "ادخل رقم المستند",
              },
            ],
          },
          {
            name: "start_date",
            label: "تاريخ الإصدار",
            type: "date",
            placeholder: "تاريخ الإصدار",
            maxDate: {
              formId: `AddDocFormConfig-${id}`,
              field: "end_date",
            },
            validation: [
              {
                type: "required",
                message: "ادخل تاريخ الاصدار",
              },
            ],
          },
          {
            name: "end_date",
            label: "تاريخ الانتهاء",
            type: "date",
            placeholder: "تاريخ الانتهاء",
            minDate: {
              formId: `AddDocFormConfig-${id}`,
              field: "start_date",
            },
            validation: [
              {
                type: "required",
                message: "ادخل تاريخ الانتهاء",
              },
            ],
          },
          {
            name: "notification_date",
            label: "تاريخ الاشعار",
            type: "date",
            placeholder: "تاريخ الاشعار",
            minDate: {
              formId: `AddDocFormConfig-${id}`,
              field: "start_date",
            },
            maxDate: {
              formId: `AddDocFormConfig-${id}`,
              field: "end_date",
            },
            validation: [
              {
                type: "required",
                message: "ادخل تاريخ الاشعار",
              },
            ],
          },
          {
            type: "file",
            name: "files",
            label: "اضافة مستندات",
            validation: [
              {
                type: "required",
                message: "يجب ادخال مرفق على الاقل",
              },
            ],
            isMulti: true,
            fileConfig: {
              allowedFileTypes: [
                "application/pdf", // pdf
                "application/msword", // doc
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
                "image/jpeg", // jpeg & jpg
                "image/png", // png
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
    submitButtonText: "إضافة",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSubmit: async (formData) => {
      const config = id ? { params: { branch_id: id } } : undefined;
      const sendForm = serialize({
        ...formData,
        start_date: new Date(formData.start_date).toISOString().split("T")[0],
        end_date: new Date(formData.end_date).toISOString().split("T")[0],
        notification_date: new Date(formData.notification_date)
          .toISOString()
          .split("T")[0],
      });

      return await defaultSubmitHandler(sendForm, AddDocFormConfig, {
        config,
        url: `${baseURL}/companies/company-profile/official-document`,
      });
    },

    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["main-company-data", id],
      });
    },
  };
  return AddDocFormConfig;
};
