import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useConnectionDataCxt } from "../../../context/ConnectionDataCxt";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

export const AddressFormConfig = () => {
  const { user, handleRefetchDataStatus, handleRefetchProfileData } =
    useUserProfileCxt();
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
            label: "العنوان السكني بمقر العمل/العنوان الوطنى)",
            type: "text",
            placeholder: "العنوان السكني بمقر العمل / وصف دقيق عنوان وطنى) ",
            validation: [
              {
                type: "custom",
                validator: (value: string) => {
                  if (!value) return true; // Skip if empty
                  // Check if address has valid characters (allows letters, numbers, common symbols)
                  const validAddressRegex = /^[\u0600-\u06FF\s\u0020a-zA-Z0-9\.,\-_#\/()&]+$/;
                  return validAddressRegex.test(value);
                },
                message: "يجب أن يحتوي العنوان على أحرف وأرقام ورموز صالحة فقط",
              },
            ],
          },
          {
            name: "postal_code",
            label: "العنوان البريدي",
            type: "text",
            placeholder: "العنوان البريدي",
            validation: [
              {
                type: "pattern",
                value: "^[0-9]{5}$",
                message: "الرمز البريدي يجب أن يتكون من 5 أرقام فقط",
              },
            ],
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      postal_code: userContactData?.postal_code,
      address: userContactData?.address,
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
      handleRefetchProfileData();
      handleRefetchDataStatus();
      handleRefetchUserContactData();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const body = {
        ...formData,
      };

      return await defaultSubmitHandler(body, addressFormConfig, {
        url: `/contactinfos/address/${user?.user_id}`,
        method: "PUT",
      });
    },
  };
  return addressFormConfig;
};
