"use client";
import { SystemTab } from "@/modules/settings/types/SystemTab";
import LoginWaysTab from "../tabs/SettingTab-LoginWays";
import LoginIdentifierTab from "../tabs/IdentifierTab";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export function getIdentifierSettingTabs(): SystemTab[] {
  const { can } = usePermissions();

  const tabs: (SystemTab & { show: boolean })[] = [
    {
      id: "IdentifierSettingTab_Settings",
      title: "الاعداد",
      content: <LoginWaysTab />,
      show: can([PERMISSIONS.loginWay.list]),
    },
    {
      id: "IdentifierSettingTab_Identifier",
      title: "المعرف",
      content: <LoginIdentifierTab />,
      show: can(PERMISSIONS.identifier.list),
    },
  ];
  return tabs.filter((tab) => tab.show).map(({ show, ...rest }) => rest);
}
