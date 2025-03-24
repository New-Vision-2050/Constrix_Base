import { MailProvider } from "@/modules/settings/types/MailProvider";

// icons
import gmail from "@/assets/icons/gmail.png";
import yahoo from "@/assets/icons/yahhoo.png";
import outlook from "@/assets/icons/outlook.png";
import { MailProviderConfig } from "../tabs/email-setting-tab/config/GmailFormConfig";

export const MailProviders: MailProvider[] = [
  {
    id: "gmail-provider",
    title: "Gmail",
    iconSrc: gmail.src,
    formConfig: MailProviderConfig("gmail-provider"),
  },
  {
    id: "yahoo-provider",
    title: "Yahoo",
    iconSrc: yahoo.src,
    formConfig: MailProviderConfig("yahoo-provider"),
  },
  {
    id: "hotmail-provider",
    title: "Hotmail",
    iconSrc: outlook.src,
    formConfig: MailProviderConfig("hotmail-provider"),
  },
];
