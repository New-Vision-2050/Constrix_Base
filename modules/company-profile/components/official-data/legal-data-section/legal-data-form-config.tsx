import { FormConfig, useFormStore } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { CompanyLegalData } from "@/modules/company-profile/types/company";
import { useQueryClient } from "@tanstack/react-query";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { serialize } from "object-to-formdata";
import { useParams } from "@i18n/navigation";
import { RegistrationTypes } from "./registration-types";

export const LegalDataFormConfig = (
  companyLegalData: CompanyLegalData[],
  id?: string
) => {
  const { company_id }: { company_id: string | undefined } = useParams();

  const queryClient = useQueryClient();

  const LegalDataFormConfig: FormConfig = {
    formId: `company-official-data-form-${id}-${company_id}`,
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
              enableAdd: false,
              rowFields: [
                {
                  name: "registration_type_type",
                  label: "registration_type_type",
                  type: "hiddenObject",
                },
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
                  condition: (values) => {
                    return (
                      values["registration_type_type"] !=
                      RegistrationTypes.WithoutARegister
                    );
                  },
                  validation: [
                    {
                      type: "pattern",
                      value: /^700\d*$/,
                      message: "يجب أن يبدأ الرقم بـ 700 ويحتوي على أرقام فقط",
                    },
                  ],
                },
                {
                  name: "start_date",
                  label: "تاريخ الإصدار",
                  type: "date",
                  placeholder: "تاريخ الإصدار",
                  maxDate: {
                    formId: `company-official-data-form-${id}-${company_id}`,
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
                    formId: `company-official-data-form-${id}-${company_id}`,
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
                  name: "files",
                  label: "اضافة مرفق",
                  isMulti: true,
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
              deleteUrl: `${baseURL}/companies/company-profile/legal-data`,
              onDeleteSuccess: () => {
                queryClient.refetchQueries({
                  queryKey: ["company-legal-data", id, company_id],
                });
              },
            },
          },
        ],
      },
    ],
    initialValues: {
      data: [...companyLegalData].map((entry) => ({
        ...entry,
        files: entry.file,
      })),
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
      const obj = formData.data.map((obj: any) => {
        const backendFiles = Array.isArray(obj.files)
          ? obj.files.filter(
              (file: any) => file && typeof file === "object" && "url" in file
            )
          : [];
        const binaryFiles = Array.isArray(obj.files)
          ? obj.files.filter(
              (file: any) => file instanceof File || file instanceof Blob
            )
          : [];

        if (binaryFiles.length == 0 && backendFiles.length == 0) {
          useFormStore
            .getState()
            .setError(
              `company-official-data-form-${id}-${company_id}`,
              "files",
              "يجب إرفاق ملف"
            );
          return {
            success: false,
            message: "يجب إرفاق ملف",
          };
        }

        return {
          start_date: obj.start_date,
          end_date: obj.end_date,
          id: obj.id,
          file: binaryFiles,
          files: backendFiles,
        };
      });
      const newFormData = serialize(
        { data: obj },
        {
          indices: true,
        }
      );
      return await defaultSubmitHandler(newFormData, LegalDataFormConfig, {
        config: {
          params: {
            ...(id && { branch_id: id }),
            ...(company_id && { company_id }),
          },
        },
        url: `${baseURL}/companies/company-profile/legal-data/update`,
      });
    },

    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["main-company-data", id, company_id],
      });
    },
  };
  return LegalDataFormConfig;
};
