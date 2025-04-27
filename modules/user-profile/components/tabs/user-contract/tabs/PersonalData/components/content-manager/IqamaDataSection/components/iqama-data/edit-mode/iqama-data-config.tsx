import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";
import { serialize } from "object-to-formdata";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

export const IqamaDataFormConfig = () => {
  const { user } = useUserProfileCxt();
  const { userIdentityData } = usePersonalDataTabCxt();
  const { handleRefetchDataStatus } = useUserProfileCxt();

  const iqamaDataFormConfig: FormConfig = {
    formId: "iqama-entry-data-form",
    title: "بيانات الاقامة",
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
            label: "رقم الاقامة",
            type: "text",
            placeholder: "رقم الاقامة",
          },
          {
            name: "entry_number_start_date",
            label: "تاريخ الاصدار",
            type: "date",
            placeholder: "تاريخ الاصدار",
          },
          {
            name: "entry_number_end_date",
            label: "تاريخ الانتهاء",
            type: "date",
            placeholder: "تاريخ الانتهاء",
          },
          {
            name: "file_entry_number",
            label: "ارفاق رقم الاقامة",
            type: "image",
            placeholder: "ارفاق رقم الاقامة",
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      entry_number: userIdentityData?.entry_number,
      entry_number_start_date: userIdentityData?.entry_number_start_date,
      entry_number_end_date: userIdentityData?.entry_number_end_date,
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
  return iqamaDataFormConfig;
};
