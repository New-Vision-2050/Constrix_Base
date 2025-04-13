import { SocialFormConfig } from "../tabs/social-setting-tab/config/SmsFormConfig";
import { SocialProvider } from "@/modules/settings/types/SocialProvider";

export const SocialProviders: SocialProvider[] = [
  {
    id: "social-vd-app",
    title: "تطبيق VD",
    formConfig: SocialFormConfig,
  },
  {
    id: "social-website",
    title: "Website",
    formConfig: SocialFormConfig,
  },
];
