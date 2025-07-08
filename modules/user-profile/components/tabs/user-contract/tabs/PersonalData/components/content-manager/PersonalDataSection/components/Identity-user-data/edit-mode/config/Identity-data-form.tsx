import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../../context/PersonalDataCxt";
import { serialize } from "object-to-formdata";
import { formatDateYYYYMMDD } from "@/utils/format-date-y-m-d";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useTranslations } from "next-intl";

export const IdentityDataFormConfig = () => {
  const { userIdentityData, handleRefreshIdentityData } =
    usePersonalDataTabCxt();
  const { handleRefetchDataStatus, user } = useUserProfileCxt();
  const t = useTranslations("UserProfile.tabs.FormLabels");
  const formT = useTranslations("UserProfile.tabs.IdentityDataForm");

  const IdentityFormConfig: FormConfig = {
    formId: "Identity-data-form",
    title: formT("title"),
    apiUrl: `${baseURL}/company-users/identity-data`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        title: formT("sectionTitle"),
        fields: [
          {
            name: "identity",
            label: t("identityNumber"),
            type: "text",
            placeholder: t("identityNumber"),
            validation: [
              {
                type: "required",
                message: formT("identityNumberRequired"),
              },
              {
                type: "pattern",
                value: /^[12]\d{9}$/,
                message: formT("identityNumberPatternStart"),
              },
              {
                type: "minLength",
                value: 10,
                message: formT("identityNumberLength"),
              },
              {
                type: "maxLength",
                value: 10,
                message: formT("identityNumberLength"),
              },
              {
                type: "pattern",
                value: /^\d+$/,
                message: formT("identityNumberDigitsOnly"),
              },
            ],
          },
          {
            label: t("entryDate"),
            type: "date",
            name: "identity_start_date",
            placeholder: t("entryDate"),
            validation: [
              {
                type: "required",
                message: formT("entryDateRequired"),
              },
            ],
            maxDate: {
              formId: `Identity-data-form`,
              field: "identity_end_date",
            },
          },
          {
            label: t("expiryDate"),
            type: "date",
            name: "identity_end_date",
            placeholder: t("expiryDate"),
            validation: [
              {
                type: "required",
                message: formT("expiryDateRequired"),
              },
            ],
            minDate: {
              formId: `Identity-data-form`,
              field: "identity_start_date",
              // shift:{
              //   value: -3, //any number
              //   unit: 'months' //'days' | 'months' | 'years' ===> default 'days'
              // }
            },
          },
          {
            label: t("identityAttachment"),
            type: "file",
            isMulti: true,
            name: "file_identity",
            placeholder: t("passportNumber"),
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
      identity: userIdentityData?.identity,
      identity_start_date: userIdentityData?.identity_start_date,
      identity_end_date: userIdentityData?.identity_end_date,
      file_identity: userIdentityData?.file_identity,
    },
    submitButtonText: formT("submitButtonText"),
    cancelButtonText: formT("cancelButtonText"),
    showReset: false,
    resetButtonText: formT("resetButtonText"),
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,
    onSuccess: () => {
      handleRefreshIdentityData();
      handleRefetchDataStatus();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const startDate = new Date(formData?.identity_start_date as string);
      const endDate = new Date(formData?.identity_end_date as string);

      const body = {
        ...formData,
        identity_start_date: formatDateYYYYMMDD(startDate),
        identity_end_date: formatDateYYYYMMDD(endDate),
      };

      return await defaultSubmitHandler(serialize(body), IdentityFormConfig, {
        url: `/company-users/identity-data/${user?.user_id}`,
        method: "POST",
      });
    },
  };
  return IdentityFormConfig;
};
