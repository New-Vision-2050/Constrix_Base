import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useConnectionDataCxt } from "../../../context/ConnectionDataCxt";

export const AddressFormConfig = () => {
  const { user, handleRefetchDataStatus } = useUserProfileCxt();
  const { userContactData, handleRefetchUserContactData } =
    useConnectionDataCxt();

  const addressFormConfig: FormConfig = {
    formId: "ConnectionInformation-address-data-form",
    title: "العنوان",
    apiUrl: `${baseURL}/contactinfos/address/${user?.user_id}`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "address",
            label: "العنوان السكني بمقر العمل / وصف دقيق عنوان وطنى) ",
            type: "text",
            placeholder: "العنوان السكني بمقر العمل / وصف دقيق عنوان وطنى) ",
          },
          {
            name: "postal_code",
            label: "العنوان البريدي",
            type: "text",
            placeholder: "العنوان البريدي",
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      postal_code: userContactData?.postal_code,
      address: userContactData?.address,
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
      handleRefetchUserContactData();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const body = {
        ...formData,
      };

      const response = await apiClient.put(
        `/contactinfos/address/${user?.user_id}`,
        body
      );
      return {
        success: true,
        message: response.data?.message || "Form submitted successfully",
        data: response.data || {},
      };
    },
  };
  return addressFormConfig;
};
