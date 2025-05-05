import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { useQueryClient } from "@tanstack/react-query";
import { serialize } from "object-to-formdata";

export const LegalDataAddReqFormEditConfig = (id?: string) => {
  const queryClient = useQueryClient();
  const LegalDataAddReqFormEditConfig: FormConfig = {
    formId: `company-official-data-form-${id}`,
    title: "اضافة بيان قانوني",
    apiUrl: `${baseURL}/companies/company-profile/legal-data/create-legal-data`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            type: "select",
            name: "registration_type_id",
            label: "نوع التسجل",
            placeholder: "نوع التسجل",
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
                message: "ادخل نوع التسجل",
              },
            ],
          },
          {
            name: "regestration_number",
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
            name: "start_date",
            label: "تاريخ الإصدار",
            type: "date",
            maxDate: {
                  formId: `company-official-data-form-${id}`,
                  field: "end_date",
            },
            placeholder: "تاريخ الإصدار",
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
                  formId: `company-official-data-form-${id}`,
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
            type: "file",
            name: "file",
            label: "اضافة مرفق",
            validation: [
              {
                type: "required",
                message: "اضافة مرفق مطلوب",
              },
            ],
            isMulti: false,
            fileConfig: {
              maxFileSize: 5 * 1024 * 1024, // 10MB
              showThumbnails: true,
            },
          },
        ],
      },
    ],
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,
    onSubmit: async (formData: Record<string, unknown>) => {
      const config = id ? { params: { branch_id: id } } : undefined;

      const obj = {
        registration_type_id: formData.registration_type_id,
        regestration_number: formData.regestration_number,
        start_date: formData.start_date,
        end_date: formData.end_date,
        file: formData.file,
      };

      const newFormData = serialize(obj);

      const response = await apiClient.post(
        "companies/company-profile/legal-data/create-legal-data",
        newFormData,
        config
      );

      if (response.status === 200) {
        queryClient.refetchQueries({
          queryKey: ["main-company-data", id],
        });
      }
      return {
        success: true,
        message: "dummy return",
        data: response.data,
      };
    },
  };
  return LegalDataAddReqFormEditConfig;
};
