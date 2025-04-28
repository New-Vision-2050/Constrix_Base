import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../../context/PersonalDataCxt";
import { serialize } from "object-to-formdata";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

export const PassportDataFormConfig = () => {
  const { userIdentityData,handleRefreshIdentityData } = usePersonalDataTabCxt();
  const { handleRefetchDataStatus, user } = useUserProfileCxt();

  const PassportFormConfig: FormConfig = {
    formId: "Passport-data-form",
    title: "بيانات جواز السفر",
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
            label: "رقم جواز السغر",
            type: "text",
            placeholder: "رقم جواز السغر",
            validation: [
              {
                type: "required",
                message: "رقم الجواز مطلوب",
              },
            ],
          },
          {
            label: "تاريخ الأستلام",
            type: "date",
            name: "passport_start_date",
            placeholder: "تاريخ الأستلام",
            validation: [
              {
                type: "required",
                message: "تاريخ الأستلام مطلوب",
              },
            ],
          },
          {
            label: "تاريخ الأنتهاء",
            type: "date",
            name: "passport_end_date",
            placeholder: "تاريخ الأنتهاء",
            validation: [
              {
                type: "required",
                message: "تاريخ الأنتهاء مطلوب",
              },
            ],
          },
          {
            label: "ارفاق الهوية",
            type: "image",
            isMulti: true,
            name: "file_passport",
            placeholder: "ارفاق الهوية",
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
    submitButtonText: "Submit",
    cancelButtonText: "Cancel",
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
      const startDate = new Date(formData?.passport_start_date as string);
      const endDate = new Date(formData?.passport_end_date as string);

      const body = {
        ...formData,
        passport_start_date: formatDate(startDate),
        passport_end_date: formatDate(endDate),
      };

      const response = await apiClient.post(
        `/company-users/identity-data/${user?.user_id}`,
        serialize(body)
      );
      return {
        success: true,
        message: response.data?.message || "Form submitted successfully",
        data: response.data || {},
      };
    },
  };
  return PassportFormConfig;
};
