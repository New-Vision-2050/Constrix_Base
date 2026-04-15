"use client";

import { useMemo } from "react";
import { SystemTab } from "@/modules/settings/types/SystemTab";
import {
  // Building2,
  // Layout,
  Paperclip,
  // Users,
  UserCog,
  ClipboardList,
  DollarSign,
  FileText,
  Share2,
} from "lucide-react";
import FolderSyncIconWithCount from "@/components/icons/folder-sync";
import ProjectDataTab from "../tabs/project-data";
import WorkspaceTab from "../tabs/workspace";
import AttachmentsTab from "../tabs/attachments";
// import ContractorsTab from "../tabs/contractors";
import StaffTab from "../tabs/staff";
// import WorkOrdersTab from "../tabs/work-orders";
// import FinancialTab from "../tabs/financial";
// import ContractManagementTab from "../tabs/contract-management";
import DocumentCycleTab from "../tabs/document-cycle";
import useCurrentAuthCompany from "@/hooks/use-auth-company";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import ShareTab from "../tabs/share";

const ALL_TABS: SystemTab[] = [
  // {
  //   id: "project-tab-data",
  //   title: "بيانات المشروع",
  //   icon: <Building2 className="w-4 h-4" />,
  //   content: <ProjectDataTab />,
  // },
  // {
  //   id: "project-tab-workspace",
  //   title: "مساحة العمل",
  //   icon: <Layout className="w-4 h-4" />,
  //   content: <WorkspaceTab />,
  // },
  {
    id: "project-tab-attachments",
    title: "المرفقات",
    icon: <Paperclip className="w-4 h-4" />,
    content: <AttachmentsTab />,
  },
  // {
  //   id: "project-tab-contractors",
  //   title: "المقاولين",
  //   icon: <Users className="w-4 h-4" />,
  //   content: <ContractorsTab />,
  // },
  {
    id: "project-tab-staff",
    title: "المعنيين",
    icon: <UserCog className="w-4 h-4" />,
    content: <StaffTab />,
  },
  // {
  //   id: "project-tab-work-orders",
  //   title: "أوامر العمل",
  //   icon: <ClipboardList className="w-4 h-4" />,
  //   content: <WorkOrdersTab />,
  // },
  {
    id: "project-tab-share",
    title: "مشاركة المشروع",
    icon: <Share2 className="w-4 h-4" />,
    content: <ShareTab />,
  },
  // {
  //   id: "project-tab-financial",
  //   title: "المالية",
  //   icon: <DollarSign className="w-4 h-4" />,
  //   content: <FinancialTab />,
  // },
  // {
  //   id: "project-tab-contract-management",
  //   title: "ادارات العقد",
  //   icon: <FileText className="w-4 h-4" />,
  //   content: <ContractManagementTab />,
  // },
  {
    id: "project-tab-document-cycle",
    title: "دورة الوثائق",
    icon: <FolderSyncIconWithCount />,
    content: <DocumentCycleTab />,
  },
];

export function useProjectTabsList(): SystemTab[] {
  const { projectData } = useProject();
  const { data: authCompanyData } = useCurrentAuthCompany();
  const permissions = projectData?.permissions;

  return useMemo(() => {
    const ownerCompanyId = projectData?.company_id;
    const currentCompanyId = authCompanyData?.payload?.id;
    const showShareTab =
      Boolean(ownerCompanyId) &&
      Boolean(currentCompanyId) &&
      ownerCompanyId === currentCompanyId;

    const projectTabs = ALL_TABS.filter(
      (tab) => tab.id !== "project-tab-share" || showShareTab, // show share tab only if the current company is the owner company
    );

    // While permissions are not yet loaded, show all tabs (except share when not owner company)
    if (!permissions) return projectTabs;

    return projectTabs.filter((tab) => {
      switch (tab.id) {
        case "project-tab-contractors":
          return (
            permissions.contractor_contract_setting?.is_all_data_visible === 1
          );
        case "project-tab-staff":
          return (
            permissions.employee_contract_setting?.is_all_data_visible === 1
          );
        case "project-tab-document-cycle":
          return (
            permissions.attachment_cycle_setting?.is_all_data_visible === 1
          );
        case "project-tab-contract-management":
          return (
            permissions.department_contract_setting?.is_all_data_visible === 1
          );
        default:
          return true;
      }
    });
  }, [permissions, projectData?.company_id, authCompanyData?.payload?.id]);
}
