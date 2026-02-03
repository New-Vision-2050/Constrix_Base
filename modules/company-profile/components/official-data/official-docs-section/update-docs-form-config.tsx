import { apiClient, baseURL } from "@/config/axios-config";
import { CompanyDocument } from "@/modules/company-profile/types/company";
import { FormConfig, useFormStore } from "@/modules/form-builder";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "@i18n/navigation";
import { serialize } from "object-to-formdata";
import { useTranslations } from "next-intl";
export const updateDocsFormConfig = (
  doc: CompanyDocument,
  id?: string,
  onSuccess?: () => void
) => {
  const { company_id }: { company_id: string | undefined } = useParams();
  const queryClient = useQueryClient();
 const t = useTranslations("UserProfile.header.nationalAddress");
  const updateDocsFormConfig: FormConfig = {
    formId: `updateDocsFormConfig-${doc.id}-${id}-${company_id}`,
    title: t("updateDoc"),
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
            label: t("docType"),
            placeholder: t("docType"),
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
                message: t("docTypeRequired"),
              },
            ],
          },
          {
            name: "name",
            label: t("docName"),
            type: "text",
            placeholder: t("docNamePlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("docNameRequired"),
              },
            ],
          },
          {
            name: "description",
            label: t("docDescription"),
            type: "text",
            placeholder: t("docDescriptionPlaceholder") ,
          },
          {
            name: "document_number",
            label: t("docNumber"),
            type: "text",
            placeholder: t("docNumberPlaceholder"),
          },
          {
            name: "start_date",
            label: t("startDate"),
            type: "date",
            placeholder: t("startDatePlaceholder"),
            maxDate: {
              formId: `updateDocsFormConfig-${doc.id}-${id}-${company_id}`,
              field: "end_date",
            },
            validation: [
              {
                type: "required",
                message: t("startDateRequired"),
              },
            ],
          },
          {
            name: "end_date",
            label: t("endDate"),
            type: "date",
            placeholder: t("endDatePlaceholder")  ,
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
                message: t("endDateRequired"),
              },
            ],
            onChange: (value) => {
              const endDate = new Date(value);
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
            label: t("notificationDate"),
            type: "date",
            placeholder: t("notificationDatePlaceholder") ,
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
                message: t("notificationDateRequired"),
              },
            ],
          },
          {
            type: "file",
            name: "files",
            label: t("addDocFiles"),
            validation: [
              {
                type: "required",
                message: t("addDocFilesRequired") ,
              },
            ],
            isMulti: true,
            fileConfig: {
              allowedFileTypes: [
                "application/pdf", // pdf
                "application/msword", // doc
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
                "image/jpeg", // jpeg & jpg
                "image/png", // png
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
      ...doc,
    },
    submitButtonText: t("update"),
    cancelButtonText: t("cancel"),
    showReset: false,
    resetButtonText: t("clearForm"),
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSubmit: async (formData) => {
      const pastFiles = doc.files;
      const serverFiles: number[] = formData.files
        .filter((file: any) => !(file instanceof File))
        .map((file: any) => file.id);
      const files_deleted = pastFiles
        .filter((file) => !serverFiles.includes(file.id))
        .map((file: any) => file.id);
      const files = formData.files.filter((file: any) => file instanceof File);

      const obj = {
        files,
        files_deleted,
        start_date: new Date(formData.start_date).toISOString().split("T")[0],
        end_date: new Date(formData.end_date).toISOString().split("T")[0],
        notification_date: new Date(formData.notification_date)
          .toISOString()
          .split("T")[0],
        name: formData.name,
        description: formData.description,
        document_number: formData.document_number,
        document_type_id: formData.document_type_id,
      };

      const newFormData = serialize(obj);

      return await defaultSubmitHandler(newFormData, updateDocsFormConfig, {
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
  return updateDocsFormConfig;
};
