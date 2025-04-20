import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { CompanyLegalData } from "@/modules/company-profile/types/company";

export const LegalDataReqFormEditConfig = (
  companyLegalData: CompanyLegalData[],
  id?: string
) => {
  console.log("id in LegalDataReqFormEditConfig : ", id);
  const LegalDataReqFormEditConfig: FormConfig = {
    formId: `LegalDataReqFormEditConfig-${id}`,
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
                  label: "ادخل رقم الترخيص",
                  type: "text",
                  placeholder: "ادخل رقم الترخيص",
                },
              ],
              minRows: 1,
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
    submitButtonText: "Submit",
    cancelButtonText: "Cancel",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSubmit: async (formData) => {
      const config = id ? { params: { branch_id: id } } : undefined;

      const obj = formData?.data.map((obj: any) => ({
        id: obj.id,
        registration_type_id: obj.registration_type_id,
        registration_number: obj.registration_number,
      }));

      await apiClient.post(
        "companies/company-profile/legal-data/request",
        {
          data: obj,
        },
        config
      );
      return {
        success: true,
        message: "dummy return",
        data: {},
      };
    },
  };
  return LegalDataReqFormEditConfig;
};
