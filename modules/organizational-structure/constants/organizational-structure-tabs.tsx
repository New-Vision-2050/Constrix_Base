import { SystemTab } from "@/modules/settings/types/SystemTab";
import BackpackIcon from "@/public/icons/backpack";
import { LayoutDashboardIcon, UserIcon } from "lucide-react";
import CompanyOrganizationStructure from "@/modules/organizational-structure/components/company-organization-structure";
import CompanyManagementsStructure from "@/modules/organizational-structure/components/company-management-structure";
import UsersStructureTab from "../components/organizational-structure-tabs/organizational-structure-tabs/components/employees-structure";
import EmployeesOrganizationStructure
  from '@/modules/organizational-structure/components/employees-organization-structure'

export const OrganizationalStructureSubTabs = (t: (key: string) => string): SystemTab[] => [
  {
    id: "organizational-structure-sub-tab-company-structure",
    title: t("companyStructure.title"),
    icon: <LayoutDashboardIcon />,
    content: <CompanyOrganizationStructure />,
  },
  {
    id: "organizational-structure-sub-tab-employees",
    title: t("usersStructure.title"),
    icon: <UserIcon />,
    // content: <UsersStructureTab />,
    content: <EmployeesOrganizationStructure />,
  },
  {
    id: "organizational-structure-sub-tab-managements",
    title: t("managements.title"),
    icon: <BackpackIcon />,
    content: <CompanyManagementsStructure />,
  },
];
