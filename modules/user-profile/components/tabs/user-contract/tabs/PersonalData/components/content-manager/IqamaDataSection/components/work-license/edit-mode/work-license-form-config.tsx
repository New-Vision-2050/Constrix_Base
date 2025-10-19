import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";
import { serialize } from "object-to-formdata";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useTranslations } from "next-intl";

export const WorkLicenseFormConfig = () => {
  const { userIdentityData, handleRefreshIdentityData } =
    usePersonalDataTabCxt();
  const { user, handleRefetchDataStatus } = useUserProfileCxt();
  const t = useTranslations("UserProfile.nestedTabs.licenseData");

  const workLicenseFormConfig: FormConfig = {
    formId: "ConnectionInformation-license-data-form",
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
            name: "work_permit",
            label: t("licenseNumber"),
            type: "text",
            required:true,
            placeholder: t("licenseNumber"),
             validation: [
              {
                type: "required",
                message: t("licenseNumberRequired"),
              },
              {
                type: "pattern",
                value: "^[0-9]{10}$",
                message: t("licenseNumberPattern"),
              },
            ],
          },
          {
            name: "work_permit_start_date",
            label: t("licenseStartDate"),
            type: "date",
            placeholder: t("licenseStartDate"),
            maxDate: {
              formId: `ConnectionInformation-license-data-form`,
              field: "entry_number_end_date",
            },
            validation: [],
          },
          {
            name: "work_permit_end_date",
            label: t("licenseEndDate"),
            type: "date",
            placeholder: t("licenseEndDate"),
            minDate: {
              formId: `ConnectionInformation-license-data-form`,
              field: "work_permit_start_date",
            },
            required:true,
            validation: [
              {
                type: "required",
                message: t("licenseEndDateRequired"),
              },
            ],
          },
          {
            name: "file_work_permit",
            label: t("licenseAttachment"),
            type: "file",
            isMulti: true,
            placeholder: t("licenseAttachment"),
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
      work_permit: userIdentityData?.work_permit,
      work_permit_start_date: userIdentityData?.work_permit_start_date,
      work_permit_end_date: userIdentityData?.work_permit_end_date,
      file_work_permit: userIdentityData?.file_work_permit,
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
      const startDate = new Date(formData?.work_permit_start_date as string);
      const endDate = new Date(formData?.work_permit_end_date as string);

      const body = {
        ...formData,
        work_permit_start_date: formatDate(startDate),
        work_permit_end_date: formatDate(endDate),
      };

      return await defaultSubmitHandler(
        serialize(body),
        workLicenseFormConfig,
        {
          url: `/company-users/identity-data/${user?.user_id}`,
          method: "POST",
        }
      );
    },
  };
  return workLicenseFormConfig;
};
