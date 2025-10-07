// Define the form configuration
import { useTranslations } from "next-intl";
import { baseURL } from "@/config/axios-config";
import { FormConfig } from "@/modules/form-builder";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { serialize } from "object-to-formdata";

export function getCreateNewFileFormConfig(
  t: ReturnType<typeof useTranslations>,
  onSuccessFn: () => void
): FormConfig {
  const formId = "create-new-file-form";

  return {
    formId,
    apiUrl: `${baseURL}/files`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors", // This is the default in Laravel
    },
    sections: [
      {
        fields: [
          // name
          {
            name: "name",
            label: t("name"),
            type: "text",
            placeholder: t("namePlaceholder"),
          },
          // reference_number
          {
            name: "reference_number",
            label: t("reference_number"),
            type: "text",
            placeholder: t("reference_numberPlaceholder"),
          },
          // parent_id
          {
            name: "parent_id",
            label: "parent_id",
            type: "hiddenObject",
            defaultValue: null,
          },
          // password
          {
            name: "password",
            label: t("password"),
            type: "password",
            placeholder: t("passwordPlaceholder"),
          },
          // created at
          {
            name: "start_date",
            label: t("createdAt"),
            type: "date",
            placeholder: t("createdAtPlaceholder"),
          },
          // end date
          {
            name: "end_date",
            label: t("endDate"),
            type: "date",
            placeholder: t("endDatePlaceholder"),
          },
          // public or private
          {
            name: "access_type",
            label: t("permission"),
            type: "radio",
            options: [
              {
                label: t("public"),
                value: "public",
              },
              {
                label: t("private"),
                value: "private",
              },
            ],
          },
          // users
          {
            name: "user_ids",
            label: t("users"),
            type: "select",
            isMulti: true,
            placeholder: t("usersPlaceholder"),
            dynamicOptions: {
              url: `${baseURL}/users`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
          },
          // attached file
          {
            type: "file",
            name: "file",
            label: t("file"),
            isMulti: false,
            fileConfig: {
              showThumbnails: true,
              allowedFileTypes: [
                "application/pdf", // pdf
                "application/msword", // doc
                "image/jpeg", // jpeg & jpg
                "image/png", // png
              ],
            },
          },
        ],
      },
    ],
    // editDataTransformer: (data) => {},
    onSuccess: onSuccessFn,
    onSubmit: async (formData) => {
      return await defaultSubmitHandler(
        serialize(formData),
        getCreateNewFileFormConfig(t, onSuccessFn)
      );
    },
    submitButtonText: t("submitButtonText"),
    cancelButtonText: t("cancelButtonText"),
    showReset: false,
    resetButtonText: t("resetButtonText"),
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,
  };
}
