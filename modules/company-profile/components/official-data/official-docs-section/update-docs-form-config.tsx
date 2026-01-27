import { baseURL } from "@/config/axios-config";
import { CompanyDocument } from "@/modules/company-profile/types/company";
import { FormConfig, useFormStore } from "@/modules/form-builder";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useParams } from "@i18n/navigation";
import { serialize } from "object-to-formdata";
import { useTranslations } from "next-intl";

export const useUpdateDocsFormConfig = (
  doc: CompanyDocument,
  id?: string,
  onSuccess?: () => void
) => {
  const { company_id }: { company_id: string | undefined } = useParams();
  const t = useTranslations("companyProfile");

  const config: FormConfig = {
    formId: `updateDocsFormConfig-${doc.id}-${id}-${company_id}`,
    title: t("header.placeholder.UpdateOfficialDocument"),
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
              formId: `updateDocsFormConfig-${doc.id}-${id}-${company_id}`,
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
              formId: `updateDocsFormConfig-${doc.id}-${id}-${company_id}`,
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
                .setValues(
                  `updateDocsFormConfig-${doc.id}-${id}-${company_id}`,
                  {
                    notification_date: notificationDate,
                  }
                );
            },
          },
          {
            name: "notification_date",
            label: t("header.placeholder.NotificationDate"),
            type: "date",
            placeholder: t("header.placeholder.NotificationDate"),
            minDate: {
              formId: `updateDocsFormConfig-${doc.id}-${id}-${company_id}`,
              field: "start_date",
            },
            maxDate: {
              formId: `updateDocsFormConfig-${doc.id}-${id}-${company_id}`,
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
    initialValues: {
      ...doc,
    },
    submitButtonText: t("header.placeholder.Update"),
    cancelButtonText: t("header.Label.Cancel"),
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSubmit: async (formData) => {
      const pastFiles = doc.files;
      const serverFiles: number[] = (formData.files as unknown[])
        .filter((file) => !(file instanceof File))
        .map((file: { id: number }) => file.id);
      const files_deleted = pastFiles
        .filter((file) => !serverFiles.includes(file.id))
        .map((file) => file.id);
      const files = (formData.files as unknown[]).filter((file) => file instanceof File) as File[];

      const obj = {
        files,
        files_deleted,
        start_date: new Date(formData.start_date as string).toISOString().split("T")[0],
        end_date: new Date(formData.end_date as string).toISOString().split("T")[0],
        notification_date: new Date(formData.notification_date as string)
          .toISOString()
          .split("T")[0],
        name: formData.name as string,
        description: formData.description as string,
        document_number: formData.document_number as string,
        document_type_id: formData.document_type_id as string,
      };

      const newFormData = serialize(obj);

      return await defaultSubmitHandler(newFormData, config, {
        config: {
          params: {
            ...(id && { branch_id: id }),
            ...(company_id && { company_id }),
          },
        },
        url: `${baseURL}/companies/company-profile/official-document/update/${doc.id}`,
      });
    },

    onSuccess: () => {
      onSuccess?.();
    },
  };
  return config;
};
