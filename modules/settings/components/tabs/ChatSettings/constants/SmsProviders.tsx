import { SmsProvider } from "@/modules/settings/types/SmsProvider";
import { SMSProviderConfig } from "../tabs/sms-setting-tab/config/SmsFormConfig";

export const SmsProviders: SmsProvider[] = [
  {
    id: "sms-security-key",
    title: "Security key",
    formConfig: SMSProviderConfig("sms-security-key"),
  },
  {
    id: "sms-api-key",
    title: "API Key",
    formConfig: SMSProviderConfig("sms-api-key"),
  },
];
