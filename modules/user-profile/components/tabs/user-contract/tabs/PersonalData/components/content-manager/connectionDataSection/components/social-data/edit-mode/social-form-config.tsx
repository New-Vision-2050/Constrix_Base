import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useConnectionDataCxt } from "../../../context/ConnectionDataCxt";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

export const SocialMediaSitesFormConfig = () => {
  const { user, handleRefetchDataStatus } = useUserProfileCxt();
  const { userSocialData } = useConnectionDataCxt();

  const socialMediaSitesFormConfig: FormConfig = {
    formId: "ConnectionInformation-data-form",
    title: "حسابات التواصل الاجتماعي",
    apiUrl: `${baseURL}/socials/${user?.user_id}`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "whatsapp",
            label: "واتساب ",
            type: "text",
            placeholder: "واتساب ",
          },
          {
            name: "facebook",
            label: "فيسبوك ",
            type: "text",
            placeholder: "فيسبوك ",
          },
          {
            name: "telegram",
            label: "تيليجرام ",
            type: "text",
            placeholder: "تيليجرام ",
          },
          {
            name: "instagram",
            label: "انستقرام  ",
            type: "text",
            placeholder: "انستقرام  ",
          },
          {
            name: "snapchat",
            label: "سناب شات  ",
            type: "text",
            placeholder: "سناب شات  ",
          },
          {
            name: "linkedin",
            label: "لينك اند  ",
            type: "text",
            placeholder: "لينك اند  ",
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
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
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
        url: `/socials/${user?.user_id}`,
        method: "PUT",
      });
    },
  };
  return socialMediaSitesFormConfig;
};
