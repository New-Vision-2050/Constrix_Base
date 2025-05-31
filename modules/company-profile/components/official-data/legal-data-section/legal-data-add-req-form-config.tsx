import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useQueryClient } from "@tanstack/react-query";
import { serialize } from "object-to-formdata";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useParams } from "next/navigation";
import { RegistrationTypes } from "./registration-types";

export const LegalDataAddReqFormEditConfig = (id?: string) => {
  const { company_id }: { company_id: string | undefined } = useParams();

  const queryClient = useQueryClient();
  const LegalDataAddReqFormEditConfig: FormConfig = {
    formId: `company-official-data-form-${id}-${company_id}`,
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
              valueField: "id_type",
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
            label: "رقم السجل التجاري / رقم الـ 700",
            type: "text",
            placeholder: "رقم السجل التجاري / رقم الـ 700",
            condition: (values) => {
              // Disable the field if registration_type_id is 3 (Without Commercial Register)
              const typeId = values["registration_type_id"]?.split("_")?.[1];
              return typeId !== RegistrationTypes.WithoutARegister;
            },
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
          },
          {
            type: "file",
            name: "file",
            label: "اضافة مرفق",
            isMulti: true,
            fileConfig: {
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
      const obj = {
        registration_type_id: (formData.registration_type_id as string).split(
          "_"
        )?.[0],
        regestration_number: formData.regestration_number,
        start_date: formData.start_date,
        end_date: formData.end_date,
        file: formData.file,
      };

      const newFormData = serialize(obj);

      return await defaultSubmitHandler(
        newFormData,
        LegalDataAddReqFormEditConfig,
        {
          config: {
            params: {
              ...(id && { branch_id: id }),
              ...(company_id && { company_id }),
            },
          },
          url: `${baseURL}/companies/company-profile/legal-data/create-legal-data`,
        }
      );
    },

    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["main-company-data", id, company_id],
      });
    },
  };
  return LegalDataAddReqFormEditConfig;
};
