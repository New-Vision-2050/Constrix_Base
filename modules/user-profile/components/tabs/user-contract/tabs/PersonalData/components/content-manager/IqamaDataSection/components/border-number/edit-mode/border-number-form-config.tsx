import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { serialize } from "object-to-formdata";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

export const BorderNumberFormConfig = () => {
  const { user } = useUserProfileCxt();
  const { userIdentityData, handleRefreshIdentityData } =
    usePersonalDataTabCxt();
  const { handleRefetchDataStatus } = useUserProfileCxt();

  const borderNumberFormConfig: FormConfig = {
    formId: "ConnectionInformation-data-form",
    title: "بيانات رقم الحدود - الدخول",
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
            label: "رقم الحدود",
            type: "text",
            placeholder: "رقم الحدود",
          },
          {
            name: "border_number_start_date",
            label: "تاريخ الدخول",
            type: "date",
            placeholder: "تاريخ الدخول",
            maxDate: {
              formId: `ConnectionInformation-data-form`,
              field: "border_number_end_date",
            },
          },
          {
            name: "border_number_end_date",
            label: "تاريخ الانتهاء",
            type: "date",
            placeholder: "تاريخ الانتهاء",
            minDate: {
              formId: `ConnectionInformation-data-form`,
              field: "border_number_start_date",
            },
          },
          {
            name: "file_border_number",
            label: "ارفاق رقم الحدود",
            type: "image",
            isMulti: true,
            placeholder: "ارفاق رقم الحدود",
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
      const startDate = new Date(formData?.border_number_start_date as string);
      const endDate = new Date(formData?.border_number_end_date as string);

      const body = {
        ...formData,
        border_number_start_date: formatDate(startDate),
        border_number_end_date: formatDate(endDate),
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
  return borderNumberFormConfig;
};
