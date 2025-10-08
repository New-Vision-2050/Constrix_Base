// Define the form configuration
import { useTranslations } from "next-intl";
import { baseURL } from "@/config/axios-config";
import { FormConfig } from "@/modules/form-builder";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { serialize } from "object-to-formdata";
import { DocumentT } from "../../../types/Directory";

export function getCreateNewDirConfig(
  t: ReturnType<typeof useTranslations>,
  onSuccessFn: () => void,
  editedDoc?: DocumentT
): FormConfig {
  const isEdit = Boolean(editedDoc);
  const formId = "create-new-dir-form";

  return {
    formId,
    apiUrl: isEdit
      ? `${baseURL}/folders/${editedDoc?.id}`
      : `${baseURL}/folders`,
    isEditMode: isEdit,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors", // This is the default in Laravel
    },
    initialValues: {
      name: editedDoc?.name ?? "",
      parent_id: editedDoc?.parent_id ?? null,
      // password: ,
      access_type: editedDoc?.access_type ?? "public",
      user_ids: editedDoc?.users?.map((usr) => usr.id) ?? [],
      file: editedDoc?.file ?? null,
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
          // parent_id
          {
            name: "parent_id",
            label: "",
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
            condition: (values) => values.access_type === "private",
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
        getCreateNewDirConfig(t, onSuccessFn),
        {
          url: isEdit
            ? `${baseURL}/folders/${editedDoc?.id}`
            : `${baseURL}/folders`,
        }
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
