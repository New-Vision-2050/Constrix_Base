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
  const { handleRefetchDataStatus, userId } = useUserProfileCxt();
  const t = useTranslations("UserProfile.nestedTabs.identityData");

  const IdentityFormConfig: FormConfig = {
    formId: "Identity-data-form",
    title: t("title"),
    apiUrl: `${baseURL}/company-users/identity-data`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        title: t("title"),
        fields: [
          {
            name: "identity",
            label: t("nationalId"),
            type: "text",
            placeholder: t("nationalId"),
            validation: [
              {
                type: "required",
                message: t("nationalIdRequired"),
              },
              {
                type: "pattern",
                value: /^[12]\d{9}$/,
                message: t("nationalIdPattern"),
              },
              {
                type: "minLength",
                value: 10,
                message: t("nationalIdMinLength"),
              },
              {
                type: "maxLength",
                value: 10,
                message: t("nationalIdMaxLength"),
              },
              {
                type: "pattern",
                value: /^\d+$/,
                message: t("nationalIdPattern"),
              },
            ],
          },
          {
            label: t("identityStartDate"),
            type: "date",
            name: "identity_start_date",
            placeholder: t("identityStartDate"),
            validation: [
              {
                type: "required",
                message: t("identityStartDateRequired"),
              },
            ],
            maxDate: {
              formId: `Identity-data-form`,
              field: "identity_end_date",
            },
          },
          {
            label: t("identityEndDate"),
            type: "date",
            name: "identity_end_date",
            placeholder: t("identityEndDate"),
            validation: [
              {
                type: "required",
                message: t("identityEndDateRequired"),
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
            label: t("attachment"),
            type: "file",
            isMulti: true,
            name: "file_identity",
            placeholder: t("attachment"),
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
    submitButtonText: t("save"),
    cancelButtonText: t("cancel"),
    showReset: false,
    resetButtonText: "Clear Form",
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
        url: `/company-users/identity-data${Boolean(userId) ? "/" + userId : ""}`,
        method: "POST",
      });
    },
  };
  return IdentityFormConfig;
};
