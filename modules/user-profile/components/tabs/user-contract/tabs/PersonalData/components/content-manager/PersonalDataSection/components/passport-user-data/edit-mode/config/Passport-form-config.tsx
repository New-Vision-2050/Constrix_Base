import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../../context/PersonalDataCxt";
import { serialize } from "object-to-formdata";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useTranslations } from "next-intl";

export const PassportDataFormConfig = () => {
  const { userIdentityData, handleRefreshIdentityData } =
    usePersonalDataTabCxt();
  const { handleRefetchDataStatus, user } = useUserProfileCxt();
  const t = useTranslations("UserProfile.tabs.PassportDataForm");

  const PassportFormConfig: FormConfig = {
    formId: "Passport-data-form",
    title: t("title"),
    apiUrl: `${baseURL}/company-users/contact-info`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "passport",
            label: t("passportNumber"),
            type: "text",
            placeholder: t("passportNumberPlaceholder"),
            validation: [
              {
                type: "required",
                message: t("passportNumberRequired"),
              },
              {
                type: "pattern",
                value: /^[A-Za-z0-9]{6,20}$/,
                message: t("passportNumberPattern"),
              }
            ],
          },
          {
            label: t("issueDate"),
            type: "date",
            name: "passport_start_date",
            placeholder: t("issueDatePlaceholder"),
            maxDate: {
              formId: `Passport-data-form`,
              field: "passport_end_date",
            },
            validation: [
              {
                type: "required",
                message: t("issueDateRequired"),
              },
            ],
          },
          {
            label: t("expiryDate"),
            type: "date",
            name: "passport_end_date",
            minDate: {
              formId: `Passport-data-form`,
              field: "passport_start_date",
            },
            placeholder: t("expiryDatePlaceholder"),
            validation: [
              {
                type: "required",
                message: t("expiryDateRequired"),
              },
            ],
          },
          {
            label: t("identityAttachment"),
            type: "file",
            isMulti: true,
            name: "file_passport",
            placeholder: t("identityAttachmentPlaceholder"),
            fileConfig: {
              allowedFileTypes: [
                "application/pdf", // pdf
                "image/jpeg", // jpeg & jpg
                "image/png", // png
              ],
            },
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      passport: userIdentityData?.passport,
      passport_start_date: userIdentityData?.passport_start_date,
      passport_end_date: userIdentityData?.passport_end_date,
      file_passport: userIdentityData?.file_passport,
    },
    submitButtonText: t("submitButtonText"),
    cancelButtonText: t("cancelButtonText"),
    showReset: false,
    resetButtonText: t("resetButtonText"),
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSuccess: () => {
      handleRefreshIdentityData();
      handleRefetchDataStatus();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, "0"); // Months are 0-based
        const day = `${date.getDate()}`.padStart(2, "0");

        return `${year}-${month}-${day}`;
      };
      const startDate = new Date(formData?.passport_start_date as string);
      const endDate = new Date(formData?.passport_end_date as string);

      const body = {
        ...formData,
        passport_start_date: formatDate(startDate),
        passport_end_date: formatDate(endDate),
      };

      return await defaultSubmitHandler(serialize(body), PassportFormConfig, {
        url: `/company-users/identity-data/${user?.user_id}`,
        method: "POST",
      });
    },
  };
  return PassportFormConfig;
};
