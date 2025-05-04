import { SystemTab } from "@/modules/settings/types/SystemTab";
import BackpackIcon from "@/public/icons/backpack";
import { LayoutDashboardIcon, UserIcon } from "lucide-react";

export const OrganizationalStructureSubTabs: SystemTab[] = [
  {
    id: "organizational-structure-sub-tab-company-structure",
    title: "بنية الشركة",
    icon: <LayoutDashboardIcon />,
    content: <>بنية الشركة</>,
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
    content: <>الادارات</>,
  }
];
