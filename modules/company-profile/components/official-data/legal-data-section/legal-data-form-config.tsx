import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { CompanyLegalData } from "@/modules/company-profile/types/company";
import { useQueryClient } from "@tanstack/react-query";

export const LegalDataFormConfig = (
  companyLegalData: CompanyLegalData[],
  id?: string
) => {
  const queryClient = useQueryClient();
  const LegalDataFormConfig: FormConfig = {
    formId: `company-official-data-form-${id}`,
    apiUrl: `${baseURL}/write-the-url`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            type: "dynamicRows",
            name: "data",
            label: "",
            dynamicRowOptions: {
              rowFields: [
                {
                  name: "registration_type",
                  label: "نوع التسجل",
                  type: "text",
                  placeholder: "نوع التسجل",
                  disabled: true,
                  gridArea: 4,
                },
                {
                  name: "registration_number",
                  label: "ادخل رقم السجل التجاري / رقم الـ 700",
                  type: "text",
                  placeholder: "رقم السجل التجاري",
                  disabled: true,
                  gridArea: 2,
                },
                {
                  name: "start_date",
                  label: "تاريخ الإصدار",
                  type: "date",
                  placeholder: "تاريخ الإصدار",
                  validation: [
                    {
                      type: "required",
                      message: "تاريخ الإصدار مطلوب",
                    },
                  ],
                },
                {
                  name: "end_date",
                  label: "تاريخ الانتهاء",
                  type: "date",
                  placeholder: "تاريخ الانتهاء",
                  validation: [
                    {
                      type: "required",
                      message: "تاريخ الانتهاء مطلوب",
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
                    allowedFileTypes: [
                      "application/pdf", // pdf
                      "application/msword", // doc
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
                      "image/jpeg", // jpeg & jpg
                      "image/png", // png
                    ],
                  },
                },
              ],
              maxRows: 10,
              columns: 1,
            },
          },
        ],
      },
    ],
    initialValues: {
      data: companyLegalData,
    },
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSubmit: async (formData) => {
      const config = id ? { params: { branch_id: id } } : undefined;

      const obj = formData.data.map((obj: any) => ({
        start_date: obj.start_date,
        end_date: obj.end_date,
        id: obj.id,
        ...(typeof obj.file !== "string" && { file: obj.file }),
      }));

      const response = await apiClient.postForm(
        "companies/company-profile/legal-data/update",
        { data: obj },
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
        data: {},
      };
    },
  };
  return LegalDataFormConfig;
};
