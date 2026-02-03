import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
export const ReqLegalDataEdit = () => {
  const t = useTranslations("UserProfile.header.officialData");
  const ReqLegalDataEdit: FormConfig = {
    formId: "ReqOfficialDataEdit",
    title: t("requestEdit"),
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
            label: t("countryName"),
            placeholder: t("selectCountry") ,
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
                message: t("countryNameRequired"),
              },
            ],
          },
          {
            name: "company_type",
            label: t("companyType"),
            type: "select",
            options: [{ label: t("companyTypeEngineer"), value:t("companyTypeEngineer") }],
            validation: [
              {
                type: "required",
                message: t("companyTypeRequired"),
              },
            ],
          },
          {
            name: "company_field",
            label: t("companyField"),
            type: "select",
            options: [{ label: t("companyFieldEngineer"), value:t("companyFieldEngineer") }],
            validation: [
              {
                type: "required",
                message: t("companyFieldRequired"),
              },
            ],
          },
          {
            name: "name",
            label: t("name"),
            type: "text",
            placeholder: t("enterCompanyName"),
            validation: [
              {
                type: "required",
                message: t("nameRequired"),
              },
            ],
          },
          {
            name: "bucket",
            label: t("packages"),
            type: "select",
            options: [{ label: t("packagesPremium"), value: t("packagesPremium") }],
            validation: [
              {
                type: "required",
                message: t("packagesRequired"),
              },
            ],
          },
          {
            name: "notes",
            label: t("notes"),
            type: "text",
            placeholder: t("enterNotes"),
          },
          {
            type: "file",
            name: "mainDocument",
            label: t("mainDocument"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("mainDocumentRequired")    ,
              },
            ],
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
      name: "",
      branch: "",
      name_en: "",
      company_type:  t("companyTypeEngineer"),
    },
    submitButtonText: t("requestEdit"),
    cancelButtonText: t("cancel"),
    showReset: false,
    resetButtonText: t("clearForm"),
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSubmit: async (formData: Record<string, unknown>) => {
      return {
        success: true,
        message: "dummy return",
        data: {},
      };
    },
  };
  return ReqLegalDataEdit;
};
