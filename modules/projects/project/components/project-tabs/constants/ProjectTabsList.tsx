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
} from "lucide-react";
import ProjectDataTab from "../tabs/project-data";
import WorkspaceTab from "../tabs/workspace";
import AttachmentsTab from "../tabs/attachments";
import ContractorsTab from "../tabs/contractors";
import StaffTab from "../tabs/staff";
import WorkOrdersTab from "../tabs/work-orders";
import FinancialTab from "../tabs/financial";
import ContractManagementTab from "../tabs/contract-management";

export const GetProjectTabsList = (): SystemTab[] => {
  const tabs: SystemTab[] = [
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
  ];

  return tabs;
};

