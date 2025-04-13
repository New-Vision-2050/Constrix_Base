import { SystemTab } from "@/modules/settings/types/SystemTab";
import ChatSettingEmailTab from "../tabs/email-setting-tab";
import ChatSettingSmsTab from "../tabs/sms-setting-tab";
import ChatSettingSocialTab from "../tabs/social-setting-tab";

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
    content: (
      <>
        <ChatSettingSmsTab />
      </>
    ),
  },
  {
    id: "ChatSettingsTab_social",
    title: "منصات التواصل",
    content: (
      <>
        <ChatSettingSocialTab />
      </>
    ),
  },
];
