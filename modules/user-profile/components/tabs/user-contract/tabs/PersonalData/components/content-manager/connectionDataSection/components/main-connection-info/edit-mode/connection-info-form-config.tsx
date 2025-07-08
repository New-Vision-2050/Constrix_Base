import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useConnectionDataCxt } from "../../../context/ConnectionDataCxt";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useTranslations } from "next-intl";

export const ConnectionInformationFormConfig = () => {
  const { user, handleRefetchDataStatus } = useUserProfileCxt();
  const { userContactData } = useConnectionDataCxt();
  const t = useTranslations("UserProfile.tabs.ConnectionDataSection");

  const _ConnectionInformationFormConfig: FormConfig = {
    formId: "ConnectionInformation-data-form",
    title: t("formTitle"),
    apiUrl: `${baseURL}/company-users/contact-info`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "email",
            label: t("email"),
            type: "text",
            placeholder: t("email"),
            validation: [
              {
                type: "email",
                message: t("enterValidEmail"),
              },
            ],
          },
          {
            name: "phone",
            label: t("phoneNumber"),
            type: "phone",
            placeholder: t("phoneNumber"),
            validation: [
              {
                type: "phone",
                message: t("enterValidPhone"),
              },
            ],
          },
          {
            name: "other_phone",
            label: t("alternativePhone"),
            type: "phone",
            placeholder: t("alternativePhone"),
            validation: [
              {
                type: "phone",
                message: "",
              },
            ],
          },
          {
            name: "landline_number",
            label: t("landlineNumber"),
            type: "phone",
            placeholder: t("landlineNumber"),
            validation: [
              {
                type: "phone",
                message: "",
              },
            ],
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      email: userContactData?.email,
      phone: userContactData?.phone,
      other_phone: userContactData?.other_phone,
      landline_number: userContactData?.landline_number,
    },
    submitButtonText: t("save"),
    cancelButtonText: t("cancel"),
    showReset: false,
    resetButtonText: t("reset"),
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSuccess: () => {
      handleRefetchDataStatus();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const phoneCode =
        ((formData?.phone as string) ?? "")?.split(" ")?.[0] ?? undefined;
      const otherPhoneCode =
        ((formData?.other_phone as string) ?? "")?.split(" ")?.[0] ?? undefined;
      const body = {
        ...formData,
        phone_code: phoneCode,
        code_other_phone: otherPhoneCode,
      };

      return await defaultSubmitHandler(
        body,
        _ConnectionInformationFormConfig,
        {
          url: `/contactinfos/${user?.user_id}`,
          method: "PUT",
        }
      );
    },
  };
  return _ConnectionInformationFormConfig;
};
