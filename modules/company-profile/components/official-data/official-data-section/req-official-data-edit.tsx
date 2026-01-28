import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { officialData } from "@/modules/company-profile/types/company";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useParams } from "@i18n/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { serialize } from "object-to-formdata";
import {useTranslations} from "next-intl";

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
const t = useTranslations("companyProfile");
  const reqOfficialDataEdit: FormConfig = {
    formId: `ReqOfficialDataEdit-${id}-${company_id}`,
    title: t("header.placeholder.OfficialData"),
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
            label: t("header.placeholder.country"),
            placeholder: t("header.placeholder.country"),
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
                message: t("header.placeholder.countryRequired"),
              },
            ],
          },
          {
            type: "select",
            name: "company_type_id",
            label: t("header.placeholder.companyType"),
            placeholder: t("header.placeholder.companyType"),
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
                message: t("header.placeholder.companyFieldRequired"),
              },
            ],
          },
          {
            type: "select",
            name: "company_field_id",
            label: t("header.placeholder.companyField"),
            placeholder: t("header.placeholder.companyField"),
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
                message: t("header.placeholder.companyFieldRequired"),
              },
            ],
          },
          {
            name: "name",
            label: t("header.placeholder.companyName"),
            type: "text",
            placeholder: t("header.placeholder.companyName"),
            validation: [
              {
                type: "required",
                message: t("header.placeholder.companyNameRequired"),
              },
            ],
          },
          {
            name: "bucket",
            label: t("header.placeholder.bucket"),
            type: "select",
            options: [{ label: "متميز", value: "متميز" }],
            validation: [
              {
                type: "required",
                message: t("header.placeholder.bucketRequired"),
              },
            ],
          },
          {
            name: "notes",
            label: t("header.placeholder.notes"),
            type: "text",
            placeholder: t("header.placeholder.notes"),
            validation: [
              {
                type: "required",
                message: t("header.placeholder.notesRequired"),
              },
            ],
          },
          {
            type: "file",
            name: "file",
            label: t("header.placeholder.attachFile"),
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
      bucket: "متميز",
    },
    submitButtonText: t("header.placeholder.submitRequest"),
    cancelButtonText: t("header.placeholder.cancel")  ,
    showReset: false,
    resetButtonText: "Clear Form",
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
