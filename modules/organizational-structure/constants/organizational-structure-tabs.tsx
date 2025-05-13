import { SystemTab } from "@/modules/settings/types/SystemTab";
import BackpackIcon from "@/public/icons/backpack";
import { LayoutDashboardIcon, UserIcon } from "lucide-react";
import CompanyOrganizationStructure from "@/modules/organizational-structure/components/company-organization-structure";
import ManagementsStructure from "../components/organizational-structure-tabs/organizational-structure-tabs/components/management-structure";
import CompanyManagementsStructure from '@/modules/organizational-structure/components/company-management-structure'

export const OrganizationalStructureSubTabs: SystemTab[] = [
  {
    id: "organizational-structure-sub-tab-company-structure",
    title: "بنية الشركة",
    icon: <LayoutDashboardIcon />,
    content: <CompanyOrganizationStructure />,
  },
  {
    id: "organizational-structure-sub-tab-employees",
    title: "هيكل الموظفين",
    icon: <UserIcon />,
    content: <>هيكل الموظفين</>,
  },
  {
    id: "organizational-structure-sub-tab-managements",
    title: "الادارات",
    icon: <BackpackIcon />,
    content: <CompanyManagementsStructure/>,
  }
];
