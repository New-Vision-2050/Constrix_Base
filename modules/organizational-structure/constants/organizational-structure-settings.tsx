import { SystemTab } from "@/modules/settings/types/SystemTab";
import { SlidersHorizontal, SlidersVertical, UserIcon } from "lucide-react";
import OrgStructureJobTitlesSetting from "../components/organizational-structure-tabs/organizational-structure-settings/components/org-structure-job-titles";
import OrgStructureJobTypesSetting from "../components/organizational-structure-tabs/organizational-structure-settings/components/org-structure-job-types";
import OrgStructureManagementSetting from "../components/organizational-structure-tabs/organizational-structure-settings/components/org-structure-managements-settings";
import OrgStructureDepartmentSetting from "../components/organizational-structure-tabs/organizational-structure-settings/components/org-structure-departments-settings";

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
  {
    id: "organizational-structure-settings-management",
    title: t("managements.title"),
    icon: <SlidersHorizontal width={18} />,
    content: <OrgStructureManagementSetting />,
  },
  // {
  //   id: "organizational-structure-settings-departments",
  //   title: t("departments.title"),
  //   icon: <SlidersVertical width={18} />,
  //   content: <OrgStructureDepartmentSetting />,
  // },
];
