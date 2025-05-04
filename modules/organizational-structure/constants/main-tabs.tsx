import { SystemTab } from "@/modules/settings/types/SystemTab";
import BackpackIcon from "@/public/icons/backpack";
import { LayoutDashboardIcon } from "lucide-react";

export const OrganizationalStructureMainTabs: SystemTab[] = [
  {
    id: "organizational-structure-main-tab-1",
    title: "الهيكل التنظيمي",
    icon: <LayoutDashboardIcon />,
    content: <>الهيكل التنظيمي</>,
  },
  {
    id: "organizational-structure-main-tab-2",
    title: "اعدادات الهيكل",
    icon: <BackpackIcon />,
    content: <>اعدادات الهيكل</>,
  },
];
