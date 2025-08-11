import { SystemTab } from "@/modules/settings/types/SystemTab";
import { SlidersHorizontal, SlidersVertical, UserIcon } from "lucide-react";
import OrgStructureJobTitlesSetting from "../components/organizational-structure-tabs/organizational-structure-settings/components/org-structure-job-titles";
import OrgStructureJobTypesSetting from "../components/organizational-structure-tabs/organizational-structure-settings/components/org-structure-job-types";
import OrgStructureManagementSetting from "../components/organizational-structure-tabs/organizational-structure-settings/components/org-structure-managements-settings";
import OrgStructureDepartmentSetting from "../components/organizational-structure-tabs/organizational-structure-settings/components/org-structure-departments-settings";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";

export const OrganizationalStructureSettingsTabs = (
  t: (key: string) => string
): SystemTab[] =>{
  const { can } = usePermissions();

  const tabs: (SystemTab & { show: boolean })[] = [
  {
    id: "organizational-structure-settings-job-titles",
    title: t("jobTitles.title"),
    icon: <UserIcon />,
    content: <OrgStructureJobTitlesSetting />,
    show: can(PERMISSIONS.organization.jobTitle.list),
  },
  {
    id: "organizational-structure-settings-job-types",
    title: t("jobTypes.title"),
    icon: <UserIcon />,
    content: <OrgStructureJobTypesSetting />,
    show: can(PERMISSIONS.organization.jobType.list),
  },
  {
    id: "organizational-structure-settings-management",
    title: t("managements.title"),
    icon: <SlidersHorizontal width={18} />,
    content: <OrgStructureManagementSetting />,
    show: can(PERMISSIONS.organization.management.view),
  },
  {
    id: "organizational-structure-settings-departments",
    title: t("departments.title"),
    icon: <SlidersVertical width={18} />,
    content: <OrgStructureDepartmentSetting />,
    show: can(PERMISSIONS.organization.department.view),
  },
];
return tabs.filter((tab) => tab.show).map(({ show, ...rest }) => rest);
}