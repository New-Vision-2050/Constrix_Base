// Define the form configuration
import { useTranslations } from "next-intl";
import { baseURL } from "@/config/axios-config";
import { FormConfig } from "@/modules/form-builder";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

export function getCreateNewDirConfig(
  t: ReturnType<typeof useTranslations>,
  onSuccessFn: () => void
): FormConfig {
  const formId = "create-new-dir-form";

  return {
    formId,
    apiUrl: `${baseURL}/public-docs/create-dir`,
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
          // password
          {
            name: "password",
            label: t("password"),
            type: "password",
            placeholder: t("passwordPlaceholder"),
          },
          // public or private
          {
            name: "permission",
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
            name: "users",
            label: t("users"),
            type: "select",
            isMulti: true,
            placeholder: t("usersPlaceholder"),
            dynamicOptions: {
              url: `${baseURL}/company-users/users`,
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
      return await defaultSubmitHandler(formData, getCreateNewDirConfig(t, onSuccessFn));
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
