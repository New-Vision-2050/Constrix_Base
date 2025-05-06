import { SystemTab } from "@/modules/settings/types/SystemTab";
import { UserIcon } from "lucide-react";
import OrgStructureJobTitlesSetting from "../components/organizational-structure-tabs/organizational-structure-settings/components/org-structure-job-titles";

export const OrganizationalStructureSettingsTabs: SystemTab[] = [
  {
    id: "organizational-structure-settings-job-titles",
    title: "المسميات الوظيفية",
    icon: <UserIcon />,
    content: <OrgStructureJobTitlesSetting />,
  },
  {
    id: "organizational-structure-settings-job-types",
    title: "انواع الوظائف",
    icon: <UserIcon />,
    content: <>انواع الوظائف</>,
  },
];
