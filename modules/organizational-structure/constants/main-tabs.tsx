import { SystemTab } from "@/modules/settings/types/SystemTab";
import BackpackIcon from "@/public/icons/backpack";
import { LayoutDashboardIcon } from "lucide-react";
import OrganizationalStructureTabTabs from "../components/organizational-structure-tabs/organizational-structure-tabs";
import OrganizationalStructureSettingsTab from "../components/organizational-structure-tabs/organizational-structure-settings";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export const OrganizationalStructureMainTabs = (t: (key: string) => string): SystemTab[] =>{ 
  const { can } = usePermissions();
   const tabs : (SystemTab & { show: boolean })[]=[
  {
    id: "organizational-structure-main-tab-1",
    title: t("organizational-structure-main-tab-1.title"),
    icon: <LayoutDashboardIcon />,
    content: <OrganizationalStructureTabTabs />,
    show: can(PERMISSIONS.organization.branch.view)||can(PERMISSIONS.organization.users.view)||can(PERMISSIONS.organization.management.view),
  },
  {
    id: "organizational-structure-main-tab-2",
    title: t("organizational-structure-main-tab-2.title"),
    icon: <BackpackIcon />,
    content: <OrganizationalStructureSettingsTab />,
    show: can(PERMISSIONS.organization.jobTitle.view)||can(PERMISSIONS.organization.jobType.view)||can(PERMISSIONS.organization.management.view)||can(PERMISSIONS.organization.department.view),
  },

];
  return tabs.filter((tab) => tab.show).map(({ show, ...rest }) => rest);

}