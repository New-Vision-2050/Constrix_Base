import { SmsProvider } from "@/modules/settings/types/SmsProvider";
import { SmsFormConfig } from "../tabs/sms-setting-tab/config/SmsFormConfig";

export const SmsProviders: SmsProvider[] = [
  {
    id: "sms-security-key",
    title: "Security key",
    formConfig: SmsFormConfig,
  },
  {
    id: "sms-api-key",
    title: "API Key",
    formConfig: SmsFormConfig,
  }
];
