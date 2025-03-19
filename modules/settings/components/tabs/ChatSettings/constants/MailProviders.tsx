import { MailProvider } from "@/modules/settings/types/MailProvider";

// icons
import gmail from "@/assets/icons/gmail.png";
import yahoo from "@/assets/icons/yahhoo.png";
import outlook from "@/assets/icons/outlook.png";
import { MailFormConfig } from "../tabs/email-setting-tab/config/MailFormConfig";

export const MailProviders: MailProvider[] = [
  {
    id: "gmail-provider",
    title: "Gmail",
    iconSrc: gmail.src,
    formConfig: MailFormConfig,
  },
  { id: "yahoo-provider", title: "Yahoo", iconSrc: yahoo.src },
  { id: "hotmail-provider", title: "Hotmail", iconSrc: outlook.src },
];
