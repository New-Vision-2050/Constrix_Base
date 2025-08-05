import { SystemTab } from "@/modules/settings/types/SystemTab";
import UserContractTab from "../components/tabs/user-contract";
import UserProfileTab from "../components/tabs/user-profile";
import UserActionsTabs from "../components/tabs/user-actions";
import { UserIcon, Users } from "lucide-react";
import BackpackIcon from "@/public/icons/backpack";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";

export const useGetEditModeTabsList = (
  t: (key: string) => string
): SystemTab[] => {
  const { can } = usePermissions();

  const tabs: (SystemTab & { show: boolean })[] = [
    {
      id: "edit-mode-tabs-profile",
      title: t("profile"),
      icon: <UserIcon />,
      content: <UserProfileTab />,
      show: can(Object.values(PERMISSIONS.userProfile.data.view)),
    },
    {
      id: "edit-mode-tabs-contract",
      title: t("contract"),
      icon: <Users />,
      content: <UserContractTab />,
      show: can(Object.values(PERMISSIONS.userProfile.contact.view)),
    },
    {
      id: "edit-mode-tabs-attendance",
      title: t("attendance"),
      icon: <BackpackIcon />,
      content: <>سياسة الحضور</>,
      show: true,
    },
    {
      id: "edit-mode-tabs-logs",
      title: t("usersActions"),
      icon: <BackpackIcon />,
      content: <UserActionsTabs />,
      show: true,
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return tabs.filter((tab) => tab.show).map(({ show, ...rest }) => rest);
};
