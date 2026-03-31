import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useQueryClient } from "@tanstack/react-query";
import { serialize } from "object-to-formdata";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useParams } from "@i18n/navigation";
import { RegistrationTypes } from "./registration-types";
import { useTranslations } from "next-intl";

export const LegalDataAddReqFormEditConfig = (
  id?: string,
  company_id?: string
) => {
  const queryClient = useQueryClient();
  const t = useTranslations("companyProfileLegalDataForm");
  const LegalDataAddReqFormEditConfig: FormConfig = {
    formId: `company-official-data-form-${id}-${company_id}`,
    title: t("addLegalData"),
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
            label: t("registrationTypeLabel"),
            placeholder: t("registrationType"),
            required: true,
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
                message: t("registrationType"),
              },
            ],
          },
          {
            name: "regestration_number",
            label: t("registrationNumber"),
            type: "text",
            placeholder: t("registrationNumberPlaceholder"),
            condition: (values) => {
              // Disable the field if registration_type_id is 3 (Without Commercial Register)
              const typeId = values["registration_type_id"]?.split("_")?.[1];
              return typeId !== RegistrationTypes.WithoutARegister;
            },
            validation: [
              {
                type: "pattern",
                value: /^(700|40|101)\d*$/,
                message:
                  t("registrationNumberPattern"),
              },
            ],
          },
          {
            name: "start_date",
            label: t("startDate"),
            type: "date",
            placeholder: t("startDatePlaceholder"),
            required: true,
            maxDate: {
              formId: `company-official-data-form-${id}-${company_id}`,
              field: "end_date",
            },
            validation: [
              {
                type: "required",
                message: t("startDateRequired"),
              },
            ],
          },
          {
            name: "end_date",
            label: t("endDate"),
            type: "date",
            placeholder: t("endDatePlaceholder"),
            required: true,
            minDate: {
              formId: `company-official-data-form-${id}-${company_id}`,
              field: "start_date",
            },
            validation: [
              {
                type: "required",
                message: t("endDateRequired"),
              },
            ],
          },
          {
            type: "file",
            name: "file",
            label: t("attachFile"),
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
    submitButtonText: t("save"),
    cancelButtonText: t("cancel"),
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
        queryKey: ["company-legal-data", id, company_id],
      });
    },
  };
  return LegalDataAddReqFormEditConfig;
};
