import { SystemTab } from "@/modules/settings/types/SystemTab";
import UserContractTab from "../components/tabs/user-contract";
import UserProfileTab from "../components/tabs/user-profile";
import UserActionsTabs from "../components/tabs/user-actions";
import { UserIcon, Users } from "lucide-react";
import BackpackIcon from "@/public/icons/backpack";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";

export const getEditModeTabsList = (
  t: (key: string) => string
): SystemTab[] => {
  // declare and define component state and variables
  const showenTabs: string[] = [];
  const { can } = usePermissions();

  if (can(Object.values(PERMISSIONS.userProfile.data.view)))
    showenTabs.push("edit-mode-tabs-profile");
  if (can(Object.values(PERMISSIONS.userProfile.contact.view)))
    showenTabs.push("edit-mode-tabs-contract");

  const tabs = [
    {
      id: "edit-mode-tabs-profile",
      title: t("profile"),
      icon: <UserIcon />,
      content: <UserProfileTab />,
    },
    {
      id: "edit-mode-tabs-contract",
      title: t("contract"),
      icon: <Users />,
      content: <UserContractTab />,
    },
    {
      id: "edit-mode-tabs-attendance",
      title: t("attendance"),
      icon: <BackpackIcon />,
      content: <>سياسة الحضور</>,
    },
    {
      id: "edit-mode-tabs-logs",
      title: t("usersActions"),
      icon: <BackpackIcon />,
      content: <UserActionsTabs />,
    },
  ];

  return tabs.filter((tab) => showenTabs.includes(tab.id));
};
