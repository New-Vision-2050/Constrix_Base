import { SystemTab } from "@/modules/settings/types/SystemTab";
import BackpackIcon from "@/public/icons/backpack";
import { LayoutDashboardIcon, UserIcon } from "lucide-react";
import CompanyOrganizationStructure from "@/modules/organizational-structure/components/company-organization-structure";
import CompanyManagementsStructure from "@/modules/organizational-structure/components/company-management-structure";
import UsersStructureTab from "../components/organizational-structure-tabs/organizational-structure-tabs/components/employees-structure";
import EmployeesOrganizationStructure
  from '@/modules/organizational-structure/components/employees-organization-structure'
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

export const OrganizationalStructureSubTabs = (t: (key: string) => string): SystemTab[] => {

  const viewPermission = can(PERMISSION_ACTIONS.VIEW,[PERMISSION_SUBJECTS.ORGANIZATION_BRANCH , PERMISSION_SUBJECTS.ORGANIZATION_USERS]) as {
    ORGANIZATION_BRANCH: boolean;
    ORGANIZATION_USERS: boolean;
  };

  console.log("permissions", viewPermission);

  return [
    ...(viewPermission.ORGANIZATION_BRANCH ? [  {
    id: "organizational-structure-sub-tab-company-structure",
    title: t("companyStructure.title"),
    icon: <LayoutDashboardIcon />,
    content: <CompanyOrganizationStructure />,
  },] : []),
  ...(viewPermission.ORGANIZATION_USERS ? [  {
    id: "organizational-structure-sub-tab-employees",
    title: t("usersStructure.title"),
    icon: <UserIcon />,
    // content: <UsersStructureTab />,
    content: <EmployeesOrganizationStructure />,
  }] : []),
  {
    id: "organizational-structure-sub-tab-managements",
    title: t("managements.title"),
    icon: <BackpackIcon />,
    content: <CompanyManagementsStructure />,
  },
];
}
