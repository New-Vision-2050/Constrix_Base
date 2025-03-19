import { SystemTab } from "@/modules/settings/types/SystemTab";
import ChatSettingEmailTab from "../tabs/email-setting-tab";

export const ChatSettingsTabs: SystemTab[] = [
  {
    id: "ChatSettingsTab_email",
    title: "البريد الالكتروني",
    content: (
      <>
        <ChatSettingEmailTab />
      </>
    ),
  },
  {
    id: "ChatSettingsTab_sms",
    title: "الرسائل النصية",
    content: <>الرسائل النصية</>,
  },
  {
    id: "ChatSettingsTab_social",
    title: "منصات التواصل",
    content: <>منصات التواصل</>,
  },
];
