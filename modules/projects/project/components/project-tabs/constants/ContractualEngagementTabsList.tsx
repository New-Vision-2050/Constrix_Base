"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Alert, Box } from "@mui/material";
import { SystemTab } from "@/modules/settings/types/SystemTab";
import {
  FileText,
  Paperclip,
  UserCog,
  Users,
  UsersRound,
  Wrench,
} from "lucide-react";
import FolderSyncIconWithCount from "@/components/icons/folder-sync";
import AttachmentsTab from "../tabs/attachments";
import StaffTab from "../tabs/staff";
import CadreTab from "../tabs/cadre";
import DocumentCycleTab from "../tabs/document-cycle";
import MaintenanceEmergencyTab from "../tabs/maintenance-emergency";

const STAKEHOLDERS_GROUP_ID = "engagement-tab-stakeholders";
const DOCUMENT_MANAGEMENT_GROUP_ID = "engagement-tab-document-management";

function ComingSoonTab({ message }: { message: string }) {
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Alert severity="info">{message}</Alert>
    </Box>
  );
}

export function useContractualEngagementTabsList(): SystemTab[] {
  const tProject = useTranslations("project");

  return useMemo(() => {
    const comingSoon = tProject("maintenanceEmergency.comingSoon");

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
    ];

    const stakeholdersTab: SystemTab = {
      id: STAKEHOLDERS_GROUP_ID,
      title: tProject("tabs.stakeholders"),
      icon: <Users className="w-4 h-4" />,
      content: <></>,
      nestedTabs: stakeholderSubTabs,
    };

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
          content: <ComingSoonTab message={comingSoon} />,
        },
        {
          id: "engagement-tab-document-requirements",
          title: tProject("tabs.documentRequirements"),
          content: <ComingSoonTab message={comingSoon} />,
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
      documentManagementTab,
      maintenanceTab,
    ];
  }, [tProject]);
}
