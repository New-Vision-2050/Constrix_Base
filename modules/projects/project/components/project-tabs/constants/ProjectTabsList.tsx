"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Alert, Box } from "@mui/material";
import { SystemTab } from "@/modules/settings/types/SystemTab";
import {
  FileText,
  Paperclip,
  UserCog,
  Share2,
  Shield,
  Users,
  UsersRound,
  Wrench,
} from "lucide-react";
import FolderSyncIconWithCount from "@/components/icons/folder-sync";
import type { ProjectPermissions } from "@/services/api/all-projects/types/response";
import AttachmentsTab from "../tabs/attachments";
import StaffTab from "../tabs/staff";
import CadreTab from "../tabs/cadre";
import DocumentCycleTab from "../tabs/document-cycle";
import DocumentRequirementsTab from "../tabs/document-requirements";
import RolesTab from "../tabs/roles";
import useCurrentAuthCompany from "@/hooks/use-auth-company";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { useProjectMyPermissionsFlat } from "@/modules/projects/project/query/useProjectMyPermissionsFlat";
import {
  hasAnyAttachmentsTabPermission,
  hasAnyDocumentCycleTabPermission,
  hasAnyRolesTabPermission,
  hasAnyStaffTabPermission,
  hasAnyShareTabPermission,
  hasAnyMaintenanceTabPermission,
} from "@/modules/projects/project/utils/projectMyPermissions";
import ShareTab from "../tabs/share";
import MaintenanceEmergencyTab from "../tabs/maintenance-emergency";

const STAKEHOLDERS_GROUP_ID = "project-tab-stakeholders";
const DOCUMENT_MANAGEMENT_GROUP_ID = "project-tab-document-management";

function ComingSoonTab({ message }: { message: string }) {
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Alert severity="info">{message}</Alert>
    </Box>
  );
}

/** Sub-sections under «أصحاب المصلحة» (RTL: المعنيين on the right). */
function createStakeholderSubTabs(
  tProject: ReturnType<typeof useTranslations<"project">>,
): SystemTab[] {
  return [
    {
      id: "project-tab-staff",
      title: tProject("tabs.concernedParties"),
      icon: <UserCog className="w-4 h-4" />,
      content: <StaffTab />,
    },
    {
      id: "project-tab-cadre",
      title: tProject("tabs.staff"),
      icon: <UsersRound className="w-4 h-4" />,
      content: <CadreTab />,
    },
    {
      id: "project-tab-roles",
      title: tProject("tabs.rolesAndPermissions"),
      icon: <Shield className="w-4 h-4" />,
      content: <RolesTab />,
    },
    {
      id: "project-tab-share",
      title: tProject("tabs.sharedEntities"),
      icon: <Share2 className="w-4 h-4" />,
      content: <ShareTab />,
    },
  ];
}

/** Sub-sections under «إدارة الوثائق». */
function createDocumentManagementSubTabs(
  tProject: ReturnType<typeof useTranslations<"project">>,
): SystemTab[] {
  const comingSoon = tProject("maintenanceEmergency.comingSoon");
  return [
    {
      id: "project-tab-document-cycle",
      title: tProject("tabs.documentCycle"),
      icon: <FolderSyncIconWithCount />,
      content: <DocumentCycleTab />,
    },
    {
      id: "project-tab-sequence-of-procedures",
      title: tProject("tabs.sequenceOfProcedures"),
      content: <ComingSoonTab message={comingSoon} />,
    },
    {
      id: "project-tab-document-requirements",
      title: tProject("tabs.documentRequirements"),
      content: <DocumentRequirementsTab />,
    },
  ];
}

function passesProjectTypeVisibility(
  tabId: string,
  permissions: ProjectPermissions | null | undefined,
): boolean {
  if (!permissions) return true;
  switch (tabId) {
    case "project-tab-staff":
    case "project-tab-cadre":
      return permissions.employee_contract_setting?.is_all_data_visible === 1;
    case "project-tab-roles":
      return (
        permissions.roles_and_permissions_setting?.is_all_data_visible === 1
      );
    case "project-tab-share":
      return permissions.project_sharing_setting?.is_all_data_visible === 1;
    case "project-tab-document-cycle":
    case "project-tab-sequence-of-procedures":
    case "project-tab-document-requirements":
      return permissions.attachment_cycle_setting?.is_all_data_visible === 1;
    case "project-tab-attachments":
      return permissions.archive_library_setting?.is_all_data_visible === 1;
    case "project-tab-maintenance":
      return permissions.maintenance_emergency_setting?.is_shown === 1;
    default:
      return true;
  }
}

function passesFlatPermission(
  tabId: string,
  projectId: string | undefined,
  flatPermissionsFetched: boolean,
  flatPerms: ReturnType<typeof useProjectMyPermissionsFlat>["data"],
): boolean {
  if (!projectId || !flatPermissionsFetched) return true;
  switch (tabId) {
    case "project-tab-attachments":
      return hasAnyAttachmentsTabPermission(flatPerms);
    case "project-tab-staff":
    case "project-tab-cadre":
      return hasAnyStaffTabPermission(flatPerms);
    case "project-tab-document-cycle":
    case "project-tab-sequence-of-procedures":
    case "project-tab-document-requirements":
      return hasAnyDocumentCycleTabPermission(flatPerms);
    case "project-tab-roles":
      return hasAnyRolesTabPermission(flatPerms);
    case "project-tab-share":
      return hasAnyShareTabPermission(flatPerms);
    case "project-tab-maintenance":
      return hasAnyMaintenanceTabPermission(flatPerms);
    default:
      return true;
  }
}

function shouldShowTopLevelTab(
  tabId: string,
  permissions: ProjectPermissions | null | undefined,
  projectId: string | undefined,
  flatPermissionsFetched: boolean,
  flatPerms: ReturnType<typeof useProjectMyPermissionsFlat>["data"],
): boolean {
  if (!passesProjectTypeVisibility(tabId, permissions)) return false;
  return passesFlatPermission(
    tabId,
    projectId,
    flatPermissionsFetched,
    flatPerms,
  );
}

export function useProjectTabsList(): SystemTab[] {
  const tProject = useTranslations("project");
  const { projectData, projectId } = useProject();
  const { data: authCompanyData } = useCurrentAuthCompany();
  const permissions = projectData?.permissions;

  const { data: flatPerms, isFetched: flatPermissionsFetched } =
    useProjectMyPermissionsFlat(projectId);

  return useMemo(() => {
    const attachmentsTab: SystemTab = {
      id: "project-tab-attachments",
      title: tProject("tabs.attachments"),
      icon: <Paperclip className="w-4 h-4" />,
      content: <AttachmentsTab />,
    };
    const maintenanceTab: SystemTab = {
      id: "project-tab-maintenance",
      title: tProject("tabs.maintenanceAndEmergencies"),
      icon: <Wrench className="w-4 h-4" />,
      content: <MaintenanceEmergencyTab />,
    };
    const stakeholderSubTabs = createStakeholderSubTabs(tProject);
    const documentManagementSubTabs =
      createDocumentManagementSubTabs(tProject);

    const ownerCompanyId = projectData?.company_id;
    const currentCompanyId = authCompanyData?.payload?.id;
    const showShareTab =
      Boolean(ownerCompanyId) &&
      Boolean(currentCompanyId) &&
      ownerCompanyId === currentCompanyId;

    const visibleStakeholderSubs = stakeholderSubTabs.filter((tab) => {
      if (tab.id === "project-tab-share" && !showShareTab) return false;
      return shouldShowTopLevelTab(
        tab.id,
        permissions,
        projectId,
        flatPermissionsFetched,
        flatPerms,
      );
    });

    const stakeholdersTab: SystemTab | null =
      visibleStakeholderSubs.length > 0
        ? {
            id: STAKEHOLDERS_GROUP_ID,
            title: tProject("tabs.stakeholders"),
            icon: <Users className="w-4 h-4" />,
            content: <></>,
            nestedTabs: visibleStakeholderSubs,
          }
        : null;

    const visibleDocumentManagementSubs = documentManagementSubTabs.filter(
      (tab) =>
        shouldShowTopLevelTab(
          tab.id,
          permissions,
          projectId,
          flatPermissionsFetched,
          flatPerms,
        ),
    );

    const documentManagementTab: SystemTab | null =
      visibleDocumentManagementSubs.length > 0
        ? {
            id: DOCUMENT_MANAGEMENT_GROUP_ID,
            title: tProject("tabs.documentManagement"),
            icon: <FileText className="w-4 h-4" />,
            content: <></>,
            nestedTabs: visibleDocumentManagementSubs,
          }
        : null;

    const topLevel: SystemTab[] = [];
    if (
      shouldShowTopLevelTab(
        "project-tab-attachments",
        permissions,
        projectId,
        flatPermissionsFetched,
        flatPerms,
      )
    ) {
      topLevel.push(attachmentsTab);
    }

    if (stakeholdersTab) topLevel.push(stakeholdersTab);

    if (documentManagementTab) topLevel.push(documentManagementTab);

    if (
      shouldShowTopLevelTab(
        "project-tab-maintenance",
        permissions,
        projectId,
        flatPermissionsFetched,
        flatPerms,
      )
    ) {
      topLevel.push(maintenanceTab);
    }

    return topLevel;
  }, [
    permissions,
    projectData?.company_id,
    authCompanyData?.payload?.id,
    projectId,
    flatPermissionsFetched,
    flatPerms,
    tProject,
  ]);
}
