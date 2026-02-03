import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { officialData } from "@/modules/company-profile/types/company";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useParams } from "@i18n/navigation";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { serialize } from "object-to-formdata";

type ReqOfficialDataEditProps = {
  officialData: officialData;
  company_id: string;
  id?: string;
};

export const ReqOfficialDataEdit = ({
  officialData,
  company_id,
  id,
}: ReqOfficialDataEditProps) => {
  const queryClient = useQueryClient();
  const t = useTranslations("UserProfile.header.officialData");
  const reqOfficialDataEdit: FormConfig = {
    formId: `ReqOfficialDataEdit-${id}-${company_id}`,
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
            placeholder: t("selectCountry"),
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
            type: "select",
            name: "company_type_id",
            label: t("companyType"),
            placeholder: t("selectCompanyType"),
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
                message: t("companyTypeRequired"),
              },
            ],
          },
          {
            type: "select",
            name: "company_field_id",
            label: t("companyField"),
            placeholder: t("selectCompanyField"),
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
            validation: [
              {
                type: "required",
                message: t("notesRequired"),
              },
            ],
          },
          {
            type: "file",
            name: "file",
            label: t("attachFiles"),
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
      bucket: t("packagesPremium"),
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
      const sendData = serialize(formData, {
        indices: true,
      });
      return await defaultSubmitHandler(sendData, reqOfficialDataEdit, {
        config: {
          params: {
            ...(id && { branch_id: id }),
            ...(company_id && { company_id }),
          },
        },
        url: `${baseURL}/companies/company-profile/official-data/request`,
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [
          "admin-requests",
          "companyOfficialDataUpdate",
          company_id,
          id,
        ],
      });
    },
  };
  return reqOfficialDataEdit;
};
