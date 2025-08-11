import { SystemTab } from "@/modules/settings/types/SystemTab";
import BackpackIcon from "@/public/icons/backpack";
import { LayoutDashboardIcon, UserIcon } from "lucide-react";
import CompanyOrganizationStructure from "@/modules/organizational-structure/components/company-organization-structure";
import CompanyManagementsStructure from "@/modules/organizational-structure/components/company-management-structure";
import UsersStructureTab from "../components/organizational-structure-tabs/organizational-structure-tabs/components/employees-structure";
import EmployeesOrganizationStructure
  from '@/modules/organizational-structure/components/employees-organization-structure'
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export const OrganizationalStructureSubTabs = (t: (key: string) => string): SystemTab[] => {
  const { can } = usePermissions();

  const tabs : (SystemTab & { show: boolean })[]=[
  {
    id: "organizational-structure-sub-tab-company-structure",
    title: t("companyStructure.title"),
    icon: <LayoutDashboardIcon />,
    content: <CompanyOrganizationStructure />,
    show: can(PERMISSIONS.organization.branch.view),
  },
  {
    id: "organizational-structure-sub-tab-employees",
    title: t("usersStructure.title"),
    icon: <UserIcon />,
    // content: <UsersStructureTab />,
    content: <EmployeesOrganizationStructure />,
    show: can(PERMISSIONS.organization.users.view),
  },
  {
    id: "organizational-structure-sub-tab-managements",
    title: t("managements.title"),
    icon: <BackpackIcon />,
    content: <CompanyManagementsStructure />,
    show: can(PERMISSIONS.organization.management.view),
  },
  ]
  
  return tabs.filter((tab) => tab.show).map(({ show, ...rest }) => rest);
};
