import { SystemTab } from "@/modules/settings/types/SystemTab";
import BackpackIcon from "@/public/icons/backpack";
import { LayoutDashboardIcon } from "lucide-react";
import OrganizationalStructureTabTabs from "../components/organizational-structure-tabs/organizational-structure-tabs";
import OrganizationalStructureSettingsTab from "../components/organizational-structure-tabs/organizational-structure-settings";

export const OrganizationalStructureMainTabs: SystemTab[] = [
  {
    id: "organizational-structure-main-tab-1",
    title: "الهيكل التنظيمي",
    icon: <LayoutDashboardIcon />,
    content: <OrganizationalStructureTabTabs />,
  },
  {
    id: "organizational-structure-main-tab-2",
    title: "اعدادات الهيكل",
    icon: <BackpackIcon />,
    content: <OrganizationalStructureSettingsTab />,
  },
];
