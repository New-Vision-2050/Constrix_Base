"use client";

import { useMemo } from "react";
import { SystemTab } from "@/modules/settings/types/SystemTab";
import {
  Building2,
  Layout,
  Paperclip,
  Users,
  UserCog,
  ClipboardList,
  DollarSign,
  FileText,
  FolderSync,
  Share2,
} from "lucide-react";
import ProjectDataTab from "../tabs/project-data";
import WorkspaceTab from "../tabs/workspace";
import AttachmentsTab from "../tabs/attachments";
import ContractorsTab from "../tabs/contractors";
import StaffTab from "../tabs/staff";
import WorkOrdersTab from "../tabs/work-orders";
import FinancialTab from "../tabs/financial";
import ContractManagementTab from "../tabs/contract-management";
import DocumentCycleTab from "../tabs/document-cycle";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import ShareTab from "../tabs/share";

const ALL_TABS: SystemTab[] = [
  {
    id: "project-tab-data",
    title: "بيانات المشروع",
    icon: <Building2 className="w-4 h-4" />,
    content: <ProjectDataTab />,
  },
  {
    id: "project-tab-workspace",
    title: "مساحة العمل",
    icon: <Layout className="w-4 h-4" />,
    content: <WorkspaceTab />,
  },
  {
    id: "project-tab-attachments",
    title: "المرفقات",
    icon: <Paperclip className="w-4 h-4" />,
    content: <AttachmentsTab />,
  },
  {
    id: "project-tab-contractors",
    title: "المقاولين",
    icon: <Users className="w-4 h-4" />,
    content: <ContractorsTab />,
  },
  {
    id: "project-tab-staff",
    title: "الكادر",
    icon: <UserCog className="w-4 h-4" />,
    content: <StaffTab />,
  },
  {
    id: "project-tab-work-orders",
    title: "أوامر العمل",
    icon: <ClipboardList className="w-4 h-4" />,
    content: <WorkOrdersTab />,
  },
  {
    id: "project-tab-share",
    title: "مشاركة المشروع",
    icon: <Share2 className="w-4 h-4" />,
    content: <ShareTab />,
  },
  {
    id: "project-tab-financial",
    title: "المالية",
    icon: <DollarSign className="w-4 h-4" />,
    content: <FinancialTab />,
  },
  {
    id: "project-tab-contract-management",
    title: "ادارات العقد",
    icon: <FileText className="w-4 h-4" />,
    content: <ContractManagementTab />,
  },
  {
    id: "project-tab-document-cycle",
    title: "دورة الوثائق",
    icon: <FolderSync className="w-4 h-4" />,
    content: <DocumentCycleTab />,
  },
];

export function useProjectTabsList(): SystemTab[] {
  const { projectData } = useProject();
  const permissions = projectData?.permissions;

  return useMemo(() => {
    // While permissions are not yet loaded, show all tabs
    if (!permissions) return ALL_TABS;

    return ALL_TABS.filter((tab) => {
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
        default:
          return true;
      }
    });
  }, [permissions]);
}
