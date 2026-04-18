"use client";

import { useMemo } from "react";
import { SystemTab } from "@/modules/settings/types/SystemTab";
import { Paperclip, UserCog, Share2, Shield, Users } from "lucide-react";
import FolderSyncIconWithCount from "@/components/icons/folder-sync";
import type { ProjectPermissions } from "@/services/api/all-projects/types/response";
import AttachmentsTab from "../tabs/attachments";
import StaffTab from "../tabs/staff";
import DocumentCycleTab from "../tabs/document-cycle";
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
} from "@/modules/projects/project/utils/projectMyPermissions";
import ShareTab from "../tabs/share";

const STAKEHOLDERS_GROUP_ID = "project-tab-stakeholders";

const ATTACHMENTS_TAB: SystemTab = {
  id: "project-tab-attachments",
  title: "المرفقات",
  icon: <Paperclip className="w-4 h-4" />,
  content: <AttachmentsTab />,
};

const DOCUMENT_CYCLE_TAB: SystemTab = {
  id: "project-tab-document-cycle",
  title: "دورة الوثائق",
  icon: <FolderSyncIconWithCount />,
  content: <DocumentCycleTab />,
};

/** Sub-sections under «أصحاب المصلحة» (RTL: المعنيين on the right). */
const STAKEHOLDER_SUB_TABS: SystemTab[] = [
  {
    id: "project-tab-staff",
    title: "المعنيين",
    icon: <UserCog className="w-4 h-4" />,
    content: <StaffTab />,
  },
  {
    id: "project-tab-roles",
    title: "الأدوار والصلاحيات",
    icon: <Shield className="w-4 h-4" />,
    content: <RolesTab />,
  },
  {
    id: "project-tab-share",
    title: "الجهات المشاركة",
    icon: <Share2 className="w-4 h-4" />,
    content: <ShareTab />,
  },
];

function passesProjectTypeVisibility(
  tabId: string,
  permissions: ProjectPermissions | null | undefined,
): boolean {
  if (!permissions) return true;
  switch (tabId) {
    case "project-tab-staff":
      return permissions.employee_contract_setting?.is_all_data_visible === 1;
    case "project-tab-roles":
      return permissions.roles_and_permissions_setting?.is_all_data_visible === 1;
    case "project-tab-share":
      return permissions.project_sharing_setting?.is_all_data_visible === 1;
    case "project-tab-document-cycle":
      return permissions.attachment_cycle_setting?.is_all_data_visible === 1;
    case "project-tab-attachments":
      return permissions.archive_library_setting?.is_all_data_visible === 1;
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
      return hasAnyStaffTabPermission(flatPerms);
    case "project-tab-document-cycle":
      return hasAnyDocumentCycleTabPermission(flatPerms);
    case "project-tab-roles":
      return hasAnyRolesTabPermission(flatPerms);
    case "project-tab-share":
      return hasAnyShareTabPermission(flatPerms);
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
  const { projectData, projectId } = useProject();
  const { data: authCompanyData } = useCurrentAuthCompany();
  const permissions = projectData?.permissions;

  const { data: flatPerms, isFetched: flatPermissionsFetched } =
    useProjectMyPermissionsFlat(projectId);

  return useMemo(() => {
    const ownerCompanyId = projectData?.company_id;
    const currentCompanyId = authCompanyData?.payload?.id;
    const showShareTab =
      Boolean(ownerCompanyId) &&
      Boolean(currentCompanyId) &&
      ownerCompanyId === currentCompanyId;

    const visibleStakeholderSubs = STAKEHOLDER_SUB_TABS.filter((tab) => {
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
            title: "أصحاب المصلحة",
            icon: <Users className="w-4 h-4" />,
            content: <></>,
            nestedTabs: visibleStakeholderSubs,
          }
        : null;

    const topLevel: SystemTab[] = [];
    if (stakeholdersTab) topLevel.push(stakeholdersTab);

    if (
      shouldShowTopLevelTab(
        "project-tab-attachments",
        permissions,
        projectId,
        flatPermissionsFetched,
        flatPerms,
      )
    ) {
      topLevel.push(ATTACHMENTS_TAB);
    }

    if (
      shouldShowTopLevelTab(
        "project-tab-document-cycle",
        permissions,
        projectId,
        flatPermissionsFetched,
        flatPerms,
      )
    ) {
      topLevel.push(DOCUMENT_CYCLE_TAB);
    }

    return topLevel;
  }, [
    permissions,
    projectData?.company_id,
    authCompanyData?.payload?.id,
    projectId,
    flatPermissionsFetched,
    flatPerms,
  ]);
}
