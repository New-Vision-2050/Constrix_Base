import { SystemTab } from "@/modules/settings/types/SystemTab";
import { UserIcon } from "lucide-react";

export const OrganizationalStructureSettingsTabs: SystemTab[] = [
  {
    id: "organizational-structure-settings-job-titles",
    title: "المسميات الوظيفية",
    icon: <UserIcon />,
    content: <>المسميات الوظيفية</>,
  },
  {
    id: "organizational-structure-settings-job-types",
    title: "انواع الوظائف",
    icon: <UserIcon />,
    content: <>انواع الوظائف</>,
  },
];
