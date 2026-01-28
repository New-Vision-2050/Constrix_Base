import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { CompanyLegalData } from "@/modules/company-profile/types/company";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

type LegalDataReqFormEditConfigProps = {
  companyLegalData: CompanyLegalData[];
  company_id: string;
  id?: string;
};

export const LegalDataReqFormEditConfig = ({
  companyLegalData,
  company_id,
  id,
}: LegalDataReqFormEditConfigProps) => {
  const queryClient = useQueryClient();
  const t = useTranslations("companyProfile");
  const LegalDataReqFormEditConfig: FormConfig = {
    formId: `LegalDataReqFormEditConfig-${id}-${company_id}`,
    title: t("header.placeholder.RequestEditLegalData"),
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
                  type: "select",
                  name: "registration_type_id",
                  label: t("header.placeholder.RegistrationType"),
                  placeholder: t("header.placeholder.RegistrationType"),
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
                      message: t("header.placeholder.RegistrationTypeRequired"),
                    },
                  ],
                },
                {
                  name: "registration_number",
                  label: t("header.placeholder.RegistrationNumber"),
                  type: "number",
                  placeholder: t("header.placeholder.RegistrationNumber"),
                  // condition: (values) => {
                  //   console.log("values", values);
                  //   // Disable the field if registration_type_id is 3 (Without Commercial Register)
                  //   const typeId =
                  //     values["registration_type_id"]?.split("_")?.[1];
                  //   return typeId !== RegistrationTypes.WithoutARegister;
                  // },
                  validation: [
                    {
                      type: "pattern",
                      value: /^700\d*$/,
                      message: t("header.placeholder.RegistrationNumberPattern"),
                    },
                  ],
                },
              ],
              minRows: 1,
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
      data: companyLegalData,
    },
    submitButtonText: t("header.Label.Save"),
    cancelButtonText: t("header.Label.Cancel"),
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSubmit: async (formData) => {
      const obj = (formData?.data as unknown[]).map((obj: any) => ({
        id: obj.id,
        registration_type_id: obj.registration_type_id,
        registration_number: obj.registration_number,
      }));

      return await defaultSubmitHandler(
        {
          data: obj,
        },
        LegalDataReqFormEditConfig,
        {
          config: {
            params: {
              ...(id && { branch_id: id }),
              ...(company_id && { company_id }),
            },
          },
          url: `${baseURL}/companies/company-profile/legal-data/request`,
        }
      );
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["admin-requests", "companyLegalDataUpdate", company_id, id],
      });
    },
  };
  return LegalDataReqFormEditConfig;
};
