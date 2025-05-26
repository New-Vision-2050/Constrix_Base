import { SystemTab } from "@/modules/settings/types/SystemTab";
import { UserIcon } from "lucide-react";
import OrgStructureJobTitlesSetting from "../components/organizational-structure-tabs/organizational-structure-settings/components/org-structure-job-titles";
import OrgStructureJobTypesSetting from "../components/organizational-structure-tabs/organizational-structure-settings/components/org-structure-job-types";

export const OrganizationalStructureSettingsTabs = (
  t: (key: string) => string
): SystemTab[] => [
  {
    id: "organizational-structure-settings-job-titles",
    title: t("jobTitles.title"),
    icon: <UserIcon />,
    content: (
      <>
        <OrgStructureJobTitlesSetting />
      </>
    ),
  },
  {
    id: "organizational-structure-settings-job-types",
    title: t("jobTypes.title"),
    icon: <UserIcon />,
    content: <OrgStructureJobTypesSetting />,
  },
];
