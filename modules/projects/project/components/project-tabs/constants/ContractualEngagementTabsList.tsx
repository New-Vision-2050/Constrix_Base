"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { SystemTab } from "@/modules/settings/types/SystemTab";
import {
  FileText,
  Paperclip,
  UserCog,
  Users,
  UsersRound,
  Wrench,
  HardHat,
  Building2,
} from "lucide-react";
import FolderSyncIconWithCount from "@/components/icons/folder-sync";
import AttachmentsTab from "../tabs/attachments";
import StaffTab from "../tabs/staff";
import CadreTab from "../tabs/cadre";
import ContractorsTab from "../tabs/contractors";
import DocumentCycleTab from "../tabs/document-cycle";
import DocumentRequirementsTab from "../tabs/document-requirements";
import SequenceOfProceduresTab from "../tabs/sequence-of-procedures";
import MaintenanceEmergencyTab from "../tabs/maintenance-emergency";
import WorkOrdersTab from "../tabs/work-orders";

const STAKEHOLDERS_GROUP_ID = "engagement-tab-stakeholders";
const CONSTRUCTIONS_GROUP_ID = "engagement-tab-constructions";
const DOCUMENT_MANAGEMENT_GROUP_ID = "engagement-tab-document-management";

export function useContractualEngagementTabsList(): SystemTab[] {
  const tProject = useTranslations("project");

  return useMemo(() => {
    const attachmentsTab: SystemTab = {
      id: "engagement-tab-attachments",
      title: tProject("tabs.attachments"),
      icon: <Paperclip className="w-4 h-4" />,
      content: <AttachmentsTab />,
    };

    const stakeholderSubTabs: SystemTab[] = [
      {
        id: "engagement-tab-staff",
        title: tProject("tabs.concernedParties"),
        icon: <UserCog className="w-4 h-4" />,
        content: <StaffTab />,
      },
      {
        id: "engagement-tab-cadre",
        title: tProject("tabs.staff"),
        icon: <UsersRound className="w-4 h-4" />,
        content: <CadreTab />,
      },
      {
        id: "engagement-tab-contractors",
        title: tProject("tabs.contractors"),
        icon: <HardHat className="w-4 h-4" />,
        content: <ContractorsTab />,
      },
    ];

    const stakeholdersTab: SystemTab = {
      id: STAKEHOLDERS_GROUP_ID,
      title: tProject("tabs.stakeholders"),
      icon: <Users className="w-4 h-4" />,
      content: <></>,
      nestedTabs: stakeholderSubTabs,
    };

    const constructionsTab: SystemTab = {
      id: CONSTRUCTIONS_GROUP_ID,
      title: tProject("tabs.constructions"),
      icon: <Building2 className="w-4 h-4" />,
      content: <></>,
      nestedTabs: [
        {
          id: "engagement-tab-work-orders",
          title: tProject("tabs.workOrders"),
          content: <WorkOrdersTab />,
        },
      ],
    };

    const documentCycleTab: SystemTab = {
      id: "engagement-tab-document-cycle",
      title: tProject("tabs.documentCycle"),
      icon: <FolderSyncIconWithCount />,
      content: <DocumentCycleTab />,
    const documentManagementTab: SystemTab = {
      id: DOCUMENT_MANAGEMENT_GROUP_ID,
      title: tProject("tabs.documentManagement"),
      icon: <FileText className="w-4 h-4" />,
      content: <></>,
      nestedTabs: [
        {
          id: "engagement-tab-document-cycle",
          title: tProject("tabs.documentCycle"),
          icon: <FolderSyncIconWithCount />,
          content: <DocumentCycleTab />,
        },
        {
          id: "engagement-tab-sequence-of-procedures",
          title: tProject("tabs.sequenceOfProcedures"),
          content: <SequenceOfProceduresTab />,
        },
        {
          id: "engagement-tab-document-requirements",
          title: tProject("tabs.documentRequirements"),
          content: <DocumentRequirementsTab />,
        },
      ],
    };

    const maintenanceTab: SystemTab = {
      id: "engagement-tab-maintenance",
      title: tProject("tabs.maintenanceAndEmergencies"),
      icon: <Wrench className="w-4 h-4" />,
      content: <MaintenanceEmergencyTab />,
    };

    return [
      attachmentsTab,
      stakeholdersTab,
      constructionsTab,
      documentCycleTab,
      documentManagementTab,
      maintenanceTab,
    ];
  }, [tProject]);
}
