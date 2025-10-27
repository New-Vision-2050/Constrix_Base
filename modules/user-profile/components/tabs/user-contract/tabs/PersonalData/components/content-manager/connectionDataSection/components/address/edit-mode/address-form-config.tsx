import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useConnectionDataCxt } from "../../../context/ConnectionDataCxt";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useTranslations } from "next-intl";

export const AddressFormConfig = () => {
  const { user, handleRefetchDataStatus, handleRefetchProfileData } =
    useUserProfileCxt();
  const { userContactData, handleRefetchUserContactData } =
    useConnectionDataCxt();
    const t = useTranslations("UserProfile.nestedTabs.addressData");

  const addressFormConfig: FormConfig = {
    formId: "ConnectionInformation-address-data-form",
    title: t("title"),
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
            label: t("addressLabel"),
            type: "text",
            placeholder: t("addressPlaceholder"),
            validation: [
              {
                type: "custom",
                validator: (value: string) => {
                  if (!value) return true; // Skip if empty
                  // Check if address has valid characters (allows letters, numbers, common symbols)
                  const validAddressRegex = /^[\u0600-\u06FF\s\u0020a-zA-Z0-9\.,\-_#\/()&]+$/;
                  return validAddressRegex.test(value);
                },
                message: t("addressValidationMessage"),
              },
            ],
          },
          {
            name: "postal_code",
            label: t("zipCode"),
            type: "text",
            placeholder: t("zipCodePlaceholder"),
            validation: [
              {
                type: "pattern",
                value: "^[0-9]{5}$",
                message: t("zipCodeValidationMessage"),
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
    submitButtonText: t("submitButtonText"),
    cancelButtonText: t("cancelButtonText"),
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
