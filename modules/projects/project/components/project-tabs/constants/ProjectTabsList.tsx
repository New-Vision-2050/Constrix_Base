"use client";

import { useMemo } from "react";
import { SystemTab } from "@/modules/settings/types/SystemTab";
import { Paperclip, UserCog, Share2, Shield } from "lucide-react";
import FolderSyncIconWithCount from "@/components/icons/folder-sync";
import AttachmentsTab from "../tabs/attachments";
// import ContractorsTab from "../tabs/contractors";
import StaffTab from "../tabs/staff";
// import WorkOrdersTab from "../tabs/work-orders";
// import FinancialTab from "../tabs/financial";
// import ContractManagementTab from "../tabs/contract-management";
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
} from "@/modules/projects/project/utils/projectMyPermissions";
import ShareTab from "../tabs/share";

const ALL_TABS: SystemTab[] = [
  {
    id: "project-tab-attachments",
    title: "المرفقات",
    icon: <Paperclip className="w-4 h-4" />,
    content: <AttachmentsTab />,
  },
  {
    id: "project-tab-staff",
    title: "المعنيين",
    icon: <UserCog className="w-4 h-4" />,
    content: <StaffTab />,
  },
  {
    id: "project-tab-share",
    title: "مشاركة المشروع",
    icon: <Share2 className="w-4 h-4" />,
    content: <ShareTab />,
  },
  {
    id: "project-tab-document-cycle",
    title: "دورة الوثائق",
    icon: <FolderSyncIconWithCount />,
    content: <DocumentCycleTab />,
  },
  {
    id: "project-tab-roles",
    title: "الأدوار",
    icon: <Shield className="w-4 h-4" />,
    content: <RolesTab />,
  },
];

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

    let projectTabs = ALL_TABS.filter(
      (tab) => tab.id !== "project-tab-share" || showShareTab,
    );

    if (permissions) {
      projectTabs = projectTabs.filter((tab) => {
        switch (tab.id) {
          case "project-tab-contractors":
            return (
              permissions.contractor_contract_setting?.is_all_data_visible === 1
            );
          case "project-tab-staff":
            return (
              permissions.employee_contract_setting?.is_all_data_visible === 1
            );
          case "project-tab-contract-management":
            return (
              permissions.department_contract_setting?.is_all_data_visible === 1
            );
          case "project-tab-document-cycle":
            return (
              permissions.attachment_cycle_setting?.is_all_data_visible === 1
            );
          case "project-tab-attachments":
            return (
              permissions.archive_library_setting?.is_all_data_visible === 1
            );
          default:
            return true;
        }
      });
    }

    if (projectId && flatPermissionsFetched) {
      projectTabs = projectTabs.filter((tab) => {
        switch (tab.id) {
          case "project-tab-attachments":
            return hasAnyAttachmentsTabPermission(flatPerms);
          case "project-tab-staff":
            return hasAnyStaffTabPermission(flatPerms);
          case "project-tab-document-cycle":
            return hasAnyDocumentCycleTabPermission(flatPerms);
          case "project-tab-roles":
            return hasAnyRolesTabPermission(flatPerms);
          default:
            return true;
        }
      });
    }

    return projectTabs;
  }, [
    permissions,
    projectData?.company_id,
    authCompanyData?.payload?.id,
    projectId,
    flatPermissionsFetched,
    flatPerms,
  ]);
}
