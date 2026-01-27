import { baseURL } from "@/config/axios-config";
import { FormConfig, useFormStore } from "@/modules/form-builder";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useQueryClient } from "@tanstack/react-query";
import { serialize } from "object-to-formdata";
import { useTranslations } from "next-intl";

export const AddDocFormConfig = (
  id?: string,
  company_id?: string,
  onClose?: () => void
) => {
  const queryClient = useQueryClient();
  const t = useTranslations("companyProfile");

  const AddDocFormConfig: FormConfig = {
    formId: `AddDocFormConfig-${id}-${company_id}`,
    title: t("header.placeholder.AddOfficialDocument"),
    apiUrl: `${baseURL}/companies/company-profile/official-document`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            type: "select",
            name: "document_type_id",
            label: t("header.placeholder.DocumentType"),
            placeholder: t("header.placeholder.DocumentType"),
            dynamicOptions: {
              url: `${baseURL}/document_types`,
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
                message: t("header.placeholder.DocumentTypeRequired"),
              },
            ],
          },
          {
            name: "name",
            label: t("header.placeholder.DocumentName"),
            type: "text",
            placeholder: t("header.placeholder.DocumentNamePlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("header.placeholder.DescriptionPlaceholder"),
              },
            ],
          },
          {
            name: "description",
            label: t("header.placeholder.Description"),
            type: "text",
            placeholder: t("header.placeholder.DescriptionPlaceholder"),
          },
          {
            name: "document_number",
            label: t("header.placeholder.DocumentNumber"),
            type: "text",
            placeholder: t("header.placeholder.DocumentNumberPlaceholder"),
          },
          {
            name: "start_date",
            label: t("header.placeholder.IssueDate"),
            type: "date",
            placeholder: t("header.placeholder.IssueDate"),
            maxDate: {
              formId: `AddDocFormConfig-${id}-${company_id}`,
              field: "end_date",
            },
            validation: [
              {
                type: "required",
                message: t("header.placeholder.IssueDateRequired"),
              },
            ],
          },
          {
            name: "end_date",
            label: t("header.placeholder.ExpiryDate"),
            type: "date",
            placeholder: t("header.placeholder.ExpiryDate"),
            minDate: {
              formId: `AddDocFormConfig-${id}-${company_id}`,
              field: "start_date",
              shift: {
                value: 8,
                unit: "days",
              },
            },
            validation: [
              {
                type: "required",
                message: t("header.placeholder.ExpiryDateRequired"),
              },
            ],
            onChange: (value) => {
              const endDate = new Date(value as string);
              endDate.setDate(endDate.getDate() - 7);
              const notificationDate = endDate.toLocaleDateString("en-CA");
              useFormStore
                .getState()
                .setValues(`AddDocFormConfig-${id}-${company_id}`, {
                  notification_date: notificationDate,
                });
            },
          },
          {
            name: "notification_date",
            label: t("header.placeholder.NotificationDate"),
            type: "date",
            placeholder: t("header.placeholder.NotificationDate"),
            minDate: {
              formId: `AddDocFormConfig-${id}-${company_id}`,
              field: "start_date",
            },
            maxDate: {
              formId: `AddDocFormConfig-${id}-${company_id}`,
              field: "end_date",
            },
            disabled: true,
            validation: [
              {
                type: "required",
                message: t("header.placeholder.NotificationDateRequired"),
              },
            ],
          },
          {
            type: "file",
            name: "files",
            label: t("header.placeholder.AddDocuments"),
            validation: [
              {
                type: "required",
                message: t("header.placeholder.AtLeastOneAttachment"),
              },
            ],
            isMulti: true,
            fileConfig: {
              allowedFileTypes: [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "image/jpeg",
                "image/png",
              ],
              maxFileSize: 5 * 1024 * 1024,
              showThumbnails: true,
            },
          },
        ],
      },
    ],
    submitButtonText: t("header.placeholder.Add"),
    cancelButtonText: t("header.Label.Cancel"),
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,
    onSubmit: async (formData) => {
      const sendForm = serialize({
        ...formData,
        document_type_id: (formData.document_type_id as string)?.split("_")?.[0],
        start_date: new Date(formData.start_date as string).toLocaleDateString("en-CA"),
        end_date: new Date(formData.end_date as string).toLocaleDateString("en-CA"),
        notification_date: new Date(
          formData.notification_date as string
        ).toLocaleDateString("en-CA"),
      });

      return await defaultSubmitHandler(sendForm, AddDocFormConfig, {
        url: `${baseURL}/companies/company-profile/official-document`,
        config: {
          params: {
            ...(id && { branch_id: id }),
            ...(company_id && { company_id }),
          },
        },
      });
    },

    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["company-official-documents", id, company_id],
      });
      onClose?.();
    },
  };
  return AddDocFormConfig;
};
