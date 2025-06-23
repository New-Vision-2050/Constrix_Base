import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { CompanyLegalData } from "@/modules/company-profile/types/company";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useQueryClient } from "@tanstack/react-query";
import { RegistrationTypes } from "./registration-types";

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
  const LegalDataReqFormEditConfig: FormConfig = {
    formId: `LegalDataReqFormEditConfig-${id}-${company_id}`,
    title: "طلب تعديل البيان القانوني",
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
                  name: "registration_number",
                  label: "رقم السجل التجاري / رقم الـ 700",
                  type: "number",
                  placeholder: "رقم السجل التجاري / رقم الـ 700",
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
                      message: "يجب أن يبدأ الرقم بـ 700 ويحتوي على أرقام فقط",
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
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSubmit: async (formData) => {
      const obj = formData?.data.map((obj: any) => ({
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
