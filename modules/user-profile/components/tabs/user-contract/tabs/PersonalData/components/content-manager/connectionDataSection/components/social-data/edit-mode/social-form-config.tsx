import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useConnectionDataCxt } from "../../../context/ConnectionDataCxt";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useTranslations } from "next-intl";


export const SocialMediaSitesFormConfig = () => {
  const { userId, handleRefetchDataStatus } = useUserProfileCxt();
  const { userSocialData } = useConnectionDataCxt();
  const t = useTranslations("UserProfile.nestedTabs.socialData");

  const socialMediaSitesFormConfig: FormConfig = {
    formId: "ConnectionInformation-data-form",
    title: t("title"),
    apiUrl: `${baseURL}/socials${Boolean(userId) ? "/" + userId : ""}`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "whatsapp",
            label: t("whatsapp"),
            type: "phone",
            placeholder: t("whatsapp"),
            validation: [
              {
                type: "phone",
                message: t("phoneValidationMessage"),
              },
            ],
          },
          {
            name: "facebook",
            label: t("facebook"),
            type: "text",
            placeholder: "https://facebook.com/username",
            validation: [
              {
                type: "url",
                message: t("urlValidationMessage"),
              }
            ],
          },
          {
            name: "telegram",
            label: t("telegram"),
            type: "phone",
            placeholder: t("telegram"),
            validation: [
              {
                type: "phone",
                message: t("phoneValidationMessage"),
              },
            ],
          },
          {
            name: "instagram",
            label: t("instagram"),
            type: "text",
            placeholder: "https://instagram.com/username",
            validation: [
              {
                type: "url",
                message: t("urlValidationMessage"),
              }
            ],
          },
          {
            name: "snapchat",
            label: t("snapchat"),
            type: "text",
            placeholder: "https://snapchat.com/add/username",
            validation: [
              {
                type: "url",
                message: t("urlValidationMessage"),
              }
            ],
          },
          {
            name: "linkedin",
            label: t("linkedin"),
            type: "text",
            placeholder: "https://linkedin.com/in/username",
            validation: [
              {
                type: "url",
                message: t("urlValidationMessage"),
              }
            ],
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      facebook: userSocialData?.facebook,
      instagram: userSocialData?.instagram,
      linkedin: userSocialData?.linkedin,
      snapchat: userSocialData?.snapchat,
      telegram: userSocialData?.telegram,
      whatsapp: userSocialData?.whatsapp,
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
      handleRefetchDataStatus();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const body = {
        ...formData,
      };

      return await defaultSubmitHandler(body, socialMediaSitesFormConfig, {
        url: `/socials${Boolean(userId) ? "/" + userId : ""}`,
        method: "PUT",
      });
    },
  };
  return socialMediaSitesFormConfig;
};
