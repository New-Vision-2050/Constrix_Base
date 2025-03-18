import { SystemTab } from "@/modules/settings/types/SystemTab";
import LoginWaysTab from "../tabs/SettingTab-LoginWays";

export const IdentifierSettingTabs: SystemTab[] = [
  {
    id: "IdentifierSettingTab_Settings",
    title: "الاعداد",
    content: (
      <>
        <LoginWaysTab />
      </>
    ),
  },
  {
    id: "IdentifierSettingTab_Identifier",
    title: "المعرف",
    content: "المعرف",
  },
];
