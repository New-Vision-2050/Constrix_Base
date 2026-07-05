"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { SystemTab } from "@/modules/settings/types/SystemTab";
import {
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
    ];

    const stakeholdersTab: SystemTab = {
      id: STAKEHOLDERS_GROUP_ID,
      title: tProject("tabs.stakeholders"),
      icon: <Users className="w-4 h-4" />,
      content: <></>,
      nestedTabs: stakeholderSubTabs,
    };

    const documentCycleTab: SystemTab = {
      id: "engagement-tab-document-cycle",
      title: tProject("tabs.documentCycle"),
      icon: <FolderSyncIconWithCount />,
      content: <DocumentCycleTab />,
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
      documentCycleTab,
      maintenanceTab,
    ];
  }, [tProject]);
}
