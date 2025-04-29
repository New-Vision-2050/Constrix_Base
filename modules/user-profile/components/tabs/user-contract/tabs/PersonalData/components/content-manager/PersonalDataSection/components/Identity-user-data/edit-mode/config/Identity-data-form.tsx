import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../../context/PersonalDataCxt";
import { serialize } from "object-to-formdata";
import { formatDateYYYYMMDD } from "@/utils/format-date-y-m-d";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

export const IdentityDataFormConfig = () => {
  const { userIdentityData,handleRefreshIdentityData } = usePersonalDataTabCxt();
  const { handleRefetchDataStatus, user } = useUserProfileCxt();

  const IdentityFormConfig: FormConfig = {
    formId: "Identity-data-form",
    title: "بيانات الهوية",
    apiUrl: `${baseURL}/company-users/identity-data`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        title: "بيانات الهوية",
        fields: [
          {
            name: "identity",
            label: "رقم الهوية",
            type: "text",
            placeholder: "رقم الهوية",
            validation: [
              {
                type: "required",
                message: "رقم الهوية مطلوب",
              },
            ],
          },
          {
            label: "تاريخ الدخول",
            type: "date",
            name: "identity_start_date",
            placeholder: "تاريخ الدخول",
            validation: [
              {
                type: "required",
                message: "تاريخ الدخول مطلوب",
              },
            ],
          },
          {
            label: "تاريخ الانتهاء",
            type: "date",
            name: "identity_end_date",
            placeholder: "تاريخ الانتهاء",
            validation: [
              {
                type: "required",
                message: "تاريخ الأنتهاء مطلوب",
              },
            ],
          },
          {
            label: "ارفاق الهوية",
            type: "file",
            isMulti: true,
            name: "file_identity",
            placeholder: "رقم جواز السفر",
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
    submitButtonText: "Submit",
    cancelButtonText: "Cancel",
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
  return IdentityFormConfig;
};
