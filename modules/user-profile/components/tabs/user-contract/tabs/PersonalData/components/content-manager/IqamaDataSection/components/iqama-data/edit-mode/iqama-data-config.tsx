import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";
import { serialize } from "object-to-formdata";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useTranslations } from "next-intl";

export const IqamaDataFormConfig = () => {
  const { userId } = useUserProfileCxt();
  const { userIdentityData, handleRefreshIdentityData } =
    usePersonalDataTabCxt();
  const { handleRefetchDataStatus } = useUserProfileCxt();
  const t = useTranslations("UserProfile.nestedTabs.iqamaData");

  const iqamaDataFormConfig: FormConfig = {
    formId: "iqama-entry-data-form",
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
            name: "entry_number",
            label: t("iqamaNumber"),
            type: "text",
            placeholder: t("iqamaNumber"),
            required:true,
            validation: [
              {
                type: "required",
                message: t("iqamaNumberRequired"),
              },
              {
                type: "pattern",
                value: "^[0-9]{10}$",
                message: t("iqamaNumberPattern"),
              },
            ],
          },
          {
            name: "entry_number_start_date",
            label: t("iqamaStartDate"),
            type: "date",
            maxDate: {
              formId: `iqama-entry-data-form`,
              field: "entry_number_end_date",
            },
            required:true,
            validation: [
              {
                type: "required",
                message: t("iqamaStartDateRequired"),
              },
            ],
            placeholder: t("iqamaStartDate"),
          },
          {
            name: "entry_number_end_date",
            label: t("iqamaEndDate"),
            type: "date",
            minDate: {
              formId: `iqama-entry-data-form`,
              field: "entry_number_start_date",
            },
            required:true,
            validation: [
              {
                type: "required",
                message: t("iqamaEndDateRequired"),
              },
            ],
            placeholder: t("iqamaEndDate"),
          },
          {
            name: "file_entry_number",
            label: t("iqamaAttachment"),
            type: "file",
            isMulti: true,
            fileConfig: {
              allowedFileTypes: [
                "application/pdf", // pdf
                "image/jpeg", // jpeg & jpg
                "image/png", // png
              ],
            },
            placeholder: t("iqamaAttachment"),
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      entry_number: userIdentityData?.entry_number,
      entry_number_start_date: userIdentityData?.entry_number_start_date,
      entry_number_end_date: userIdentityData?.entry_number_end_date,
      file_entry_number: userIdentityData?.file_entry_number,
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
      const startDate = new Date(formData?.entry_number_start_date as string);
      const endDate = new Date(formData?.entry_number_end_date as string);

      const body = {
        ...formData,
        entry_number_start_date: formatDate(startDate),
        entry_number_end_date: formatDate(endDate),
      };

      return await defaultSubmitHandler(serialize(body), iqamaDataFormConfig, {
        url: `/company-users/identity-data${Boolean(userId) ? "/" + userId : ""}`,
        method: "POST",
      });
    },
  };
  return iqamaDataFormConfig;
};
