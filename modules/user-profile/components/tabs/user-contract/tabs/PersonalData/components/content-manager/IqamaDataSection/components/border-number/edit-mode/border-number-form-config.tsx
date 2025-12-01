import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { serialize } from "object-to-formdata";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useTranslations } from "next-intl";

export const BorderNumberFormConfig = () => {
  const { userId } = useUserProfileCxt();
  const { userIdentityData, handleRefreshIdentityData } =
    usePersonalDataTabCxt();
  const { handleRefetchDataStatus } = useUserProfileCxt();
  const t = useTranslations("UserProfile.nestedTabs.borderNumberData");

  const borderNumberFormConfig: FormConfig = {
    formId: "ConnectionInformation-data-form",
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
            name: "border_number",
            label: t("borderNumber"),
            type: "text",
            placeholder: t("borderNumberPlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("borderNumberRequired"),
              },
              {
                type: "pattern",
                value: "^[0-9]{10}$",
                message: t("borderNumberPattern"),
              },
            ],
          },
          {
            name: "border_number_start_date",
            label: t("borderNumberStartDate"),
            type: "date",
            placeholder: t("borderNumberStartDate"),
            maxDate: {
              formId: `ConnectionInformation-data-form`,
              field: "border_number_end_date",
            },
            validation: [],
          },
          {
            name: "border_number_end_date",
            label: t("borderNumberEndDate"),
            type: "date",
            placeholder: t("borderNumberEndDate"),
            minDate: {
              formId: `ConnectionInformation-data-form`,
              field: "border_number_start_date",
            },
            required: true,
            validation: [
              {
                type: "required",
                message: t("borderNumberEndDateRequired"),
              },
            ],
          },
          {
            name: "file_border_number",
            label: t("borderNumberAttachment"),
            type: "file",
            isMulti: true,
            fileConfig: {
              allowedFileTypes: [
                "application/pdf", // pdf
                "image/jpeg", // jpeg & jpg
                "image/png", // png
              ],
            },
            placeholder: t("borderNumberAttachment"),
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      border_number_end_date: userIdentityData?.border_number_end_date,
      border_number_start_date: userIdentityData?.border_number_start_date,
      border_number: userIdentityData?.border_number,
      file_border_number: userIdentityData?.file_border_number,
    },
    submitButtonText: t("submitButtonText"),
    cancelButtonText: t("cancelButtonText"),
    showReset: false,
    resetButtonText: "Clear Form",
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
      const startDate = new Date(formData?.border_number_start_date as string);
      const endDate = new Date(formData?.border_number_end_date as string);

      const body = {
        ...formData,
        border_number_start_date: formatDate(startDate),
        border_number_end_date: formatDate(endDate),
      };

      return await defaultSubmitHandler(
        serialize(body),
        borderNumberFormConfig,
        {
          url: `/company-users/identity-data${Boolean(userId) ? "/" + userId : ""}`,
          method: "POST",
        }
      );
    },
  };
  return borderNumberFormConfig;
};
