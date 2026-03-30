import { baseURL } from "@/config/axios-config";
import { FormConfig, useFormStore } from "@/modules/form-builder";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "@i18n/navigation";
import { serialize } from "object-to-formdata";
import { RegistrationTypes } from "../legal-data-section/registration-types";
import { useTranslations } from "next-intl";

export const AddDocFormConfig = (
  id?: string,
  company_id?: string,
  onClose?: () => void
) => {
  const t = useTranslations("companyProfileLegalDataForm");
  const queryClient = useQueryClient();

  const AddDocFormConfig: FormConfig = {
    formId: `AddDocFormConfig-${id}-${company_id}`,
    title: t("addOfficialDocument"),
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
            label: t("documentType"),
            placeholder: t("documentTypePlaceholder"),
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
                message: t("enterDocumentType"),
              },
            ],
          },
          {
            name: "name",
            label: t("documentName"),
            type: "text",
            placeholder: t("documentNamePlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("enterDocumentName"),
              },
            ],
          },
          {
            name: "description",
            label: t("description"),
            type: "text",
            placeholder: t("descriptionPlaceholder"),
          },
          {
            name: "document_number",
            label: t("documentNumber"),
            type: "text",
            placeholder: t("documentNumberPlaceholder"),
            condition: (values) => {
              // Disable the field if registration_type_id is 3 (Without Commercial Register)
              const typeId = values["document_type_id"]?.split("_")?.[1];
              return typeId !== RegistrationTypes.WithoutARegister;
            },
          },
          {
            name: "start_date",
            label: t("issueDate"),
            type: "date",
            placeholder: t("issueDatePlaceholder"),
            maxDate: {
              formId: `AddDocFormConfig-${id}-${company_id}`,
              field: "end_date",
            },
            validation: [
              {
                type: "required",
                message: t("enterIssueDate"),
              },
            ],
          },
          {
            name: "end_date",
            label: t("expiryDate"),
            type: "date",
            placeholder: t("expiryDatePlaceholder"),
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
                message: t("enterExpiryDate"),
              },
            ],
            onChange: (value) => {
              const endDate = new Date(value);
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
            label: t("notificationDate"),
            type: "date",
            placeholder: t("notificationDatePlaceholder"),
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
                message: t("enterNotificationDate"),
              },
            ],
          },
          {
            type: "file",
            name: "files",
            label: t("addDocuments"),
            validation: [
              {
                type: "required",
                message: t("mustAttachAtLeastOneFile"),
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
    submitButtonText: t("add"),
    cancelButtonText: t("cancel"),
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,
    onSubmit: async (formData) => {
      const sendForm = serialize({
        ...formData,
        document_type_id: (formData.document_type_id as string)?.split(
          "_"
        )?.[0],
        start_date: new Date(formData.start_date).toLocaleDateString("en-CA"),
        end_date: new Date(formData.end_date).toLocaleDateString("en-CA"),
        notification_date: new Date(
          formData.notification_date
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
