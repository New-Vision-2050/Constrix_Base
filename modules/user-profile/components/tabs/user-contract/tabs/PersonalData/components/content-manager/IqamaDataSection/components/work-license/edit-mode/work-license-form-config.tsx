import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";
import { serialize } from "object-to-formdata";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

export const WorkLicenseFormConfig = () => {
  const { userIdentityData, handleRefreshIdentityData } =
    usePersonalDataTabCxt();
  const { user, handleRefetchDataStatus } = useUserProfileCxt();

  const workLicenseFormConfig: FormConfig = {
    formId: "ConnectionInformation-license-data-form",
    title: "بيانات رخصة العمل",
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
            label: "رقم رخصة العمل",
            type: "text",
            placeholder: "رقم رخصة العمل",
             validation: [
              {
                type: "required",
                message: "رقم رخصة العمل مطلوب",
              },
            ],
          },
          {
            name: "work_permit_start_date",
            label: "تاريخ الدخول",
            type: "date",
            placeholder: "تاريخ الدخول",
            maxDate: {
              formId: `ConnectionInformation-license-data-form`,
              field: "entry_number_end_date",
            },
          },
          {
            name: "work_permit_end_date",
            label: "تاريخ الانتهاء",
            type: "date",
            placeholder: "تاريخ الانتهاء",
            minDate: {
              formId: `ConnectionInformation-license-data-form`,
              field: "work_permit_start_date",
            },
          },
          {
            name: "file_work_permit",
            label: "ارفاق رخصة العمل",
            type: "file",
            isMulti: true,
            placeholder: "ارفاق رخصة العمل",
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
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
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
