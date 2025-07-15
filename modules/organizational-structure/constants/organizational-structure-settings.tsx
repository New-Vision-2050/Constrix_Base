import { SystemTab } from "@/modules/settings/types/SystemTab";
import { SlidersHorizontal, SlidersVertical, UserIcon } from "lucide-react";
import OrgStructureJobTitlesSetting from "../components/organizational-structure-tabs/organizational-structure-settings/components/org-structure-job-titles";
import OrgStructureJobTypesSetting from "../components/organizational-structure-tabs/organizational-structure-settings/components/org-structure-job-types";
import OrgStructureManagementSetting from "../components/organizational-structure-tabs/organizational-structure-settings/components/org-structure-managements-settings";
import OrgStructureDepartmentSetting from "../components/organizational-structure-tabs/organizational-structure-settings/components/org-structure-departments-settings";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

export const OrganizationalStructureSettingsTabs = (
  t: (key: string) => string
): SystemTab[] => {

    const viewPermission = can(PERMISSION_ACTIONS.VIEW,[PERMISSION_SUBJECTS.ORGANIZATION_JOB_TITLE , PERMISSION_SUBJECTS.ORGANIZATION_MANAGEMENT , PERMISSION_SUBJECTS.ORGANIZATION_DEPARTMENT]) as {
      ORGANIZATION_JOB_TITLE: boolean;
      ORGANIZATION_JOB_TYPE: boolean;
      ORGANIZATION_MANAGEMENT: boolean;
      ORGANIZATION_DEPARTMENT: boolean;
    };

  return [
    ...(viewPermission.ORGANIZATION_JOB_TITLE ? [{
      id: "organizational-structure-settings-job-titles",
      title: t("jobTitles.title"),
      icon: <UserIcon />,
      content: (
        <>
          <OrgStructureJobTitlesSetting />
        </>
      ),
    }] : []),
    ...(viewPermission.ORGANIZATION_JOB_TYPE ? [{
      id: "organizational-structure-settings-job-types",
      title: t("jobTypes.title"),
      icon: <UserIcon />,
      content: <OrgStructureJobTypesSetting />,
    }] : []),
    ...(viewPermission.ORGANIZATION_MANAGEMENT ? [{
      id: "organizational-structure-settings-management",
      title: t("managements.title"),
      icon: <SlidersHorizontal width={18} />,
      content: <OrgStructureManagementSetting />,
    }] : []),
    ...(viewPermission.ORGANIZATION_DEPARTMENT ? [{
      id: "organizational-structure-settings-departments",
      title: t("departments.title"),
      icon: <SlidersVertical width={18} />,
      content: <OrgStructureDepartmentSetting />,
    }] : []),
  ];
};
