import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { officialData } from "@/modules/company-profile/types/company";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

export const ReqOfficialDataEdit = (
  officialData: officialData,
  id?: string
) => {
  const reqOfficialDataEdit: FormConfig = {
    formId: `ReqOfficialDataEdit-${id}`,
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
            type: "select",
            name: "company_type_id",
            label: "كيان الشركة",
            placeholder: "كيان الشركة",
            dynamicOptions: {
              url: `${baseURL}/company_types`,
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
                message: "ادخل كيان الشركة",
              },
            ],
          },
          {
            type: "select",
            name: "company_field_id",
            label: "مجال الشركة",
            placeholder: "مجال الشركة",
            dynamicOptions: {
              url: `${baseURL}/company_fields`,
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
            validation: [
              {
                type: "required",
                message: "الملاحظات مطلوبة",
              },
            ],
          },
          {
            type: "file",
            name: "mainDocument",
            label: "اضافة المرفقات",
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
      name: officialData?.name ?? "",
      branch: officialData?.branch ?? "",
      name_en: officialData?.name_en ?? "",
      company_type_id: officialData?.company_type_id ?? "",
      country_id: officialData?.country_id ?? "",
      company_field_id: officialData?.company_field_id ?? "",
      phone: officialData?.phone ?? "",
      email: officialData?.email ?? "",
      bucket: "متميز",
    },
    submitButtonText: "ارسال طلب التعديل",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSubmit: async (formData: Record<string, unknown>) => {
      const config = id ? { params: { branch_id: id } } : undefined;

      return await defaultSubmitHandler(formData, reqOfficialDataEdit, {
        config,
        url: `${baseURL}/companies/company-profile/official-data/request`,
        method: "PUT",
      });
    },
  };
  return reqOfficialDataEdit;
};
