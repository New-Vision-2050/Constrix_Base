import { SystemTab } from "@/modules/settings/types/SystemTab";
import BackpackIcon from "@/public/icons/backpack";
import { LayoutDashboardIcon } from "lucide-react";
import OrganizationalStructureTabTabs from "../components/organizational-structure-tabs/organizational-structure-tabs";
import OrganizationalStructureSettingsTab from "../components/organizational-structure-tabs/organizational-structure-settings";

export const OrganizationalStructureMainTabs = (t: (key: string) => string): SystemTab[] => [
  {
    id: "organizational-structure-main-tab-1",
    title: t("organizational-structure-main-tab-1.title"),
    icon: <LayoutDashboardIcon />,
    content: <OrganizationalStructureTabTabs />,
  },
  {
    id: "organizational-structure-main-tab-2",
    title: t("organizational-structure-main-tab-2.title"),
    icon: <BackpackIcon />,
    content: <OrganizationalStructureSettingsTab />,
  },
];
