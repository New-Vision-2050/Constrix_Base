import { LayoutDashboardIcon, FolderClosed, CalendarDays } from "lucide-react";
import SettingsIcon from "@/public/icons/settings";
import InboxIconWithCount from "@/components/icons/inbox";
import { ROUTER } from "@/router";
import { Project } from "@/types/sidebar-menu";
import { SidebarProjectProps } from "./types";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { CONTRACTUAL_ENGAGEMENT_KEYS } from "@/modules/projects/project/constants/contractualEngagementKeys";

export function getWorkPanelProject({
  t,
  fullPath,
  isCentralCompany,
  can,
}: SidebarProjectProps): Project {
  const makkahUrl = ROUTER.UNIFIED_CONTRACT(
    CONTRACTUAL_ENGAGEMENT_KEYS.MAKKAH_UNIFIED,
  );
  const jeddahUrl = ROUTER.UNIFIED_CONTRACT(
    CONTRACTUAL_ENGAGEMENT_KEYS.JEDDAH_UNIFIED,
  );

  return {
    name: t("Sidebar.WorkPanel"),
    urls: [
      ROUTER.ALL_PROJECTS,
      makkahUrl,
      jeddahUrl,
      ROUTER.PROJECTS_INBOX,
      ROUTER.WORK_PANEL_SETTINGS,
      ROUTER.PROJECTS_SETTINGS,
      ROUTER.AttendancePresence,
    ],
    icon: LayoutDashboardIcon,
    isActive:
      fullPath.startsWith(ROUTER.WORK_PANEL_SETTINGS) ||
      fullPath.startsWith(ROUTER.ALL_PROJECTS) ||
      fullPath.startsWith("/unified-contract") ||
      fullPath.startsWith(ROUTER.AttendancePresence),
    slug: "work-panel",
    show: !isCentralCompany,
    sub_entities: [
      {
        name: t("Sidebar.AttendancePresence"),
        url: ROUTER.AttendancePresence,
        icon: CalendarDays,
        isActive: fullPath.startsWith(ROUTER.AttendancePresence),
        show: !isCentralCompany,
      },
      {
        name: t("Sidebar.Projects"),
        url: ROUTER.ALL_PROJECTS,
        icon: FolderClosed,
        isActive:
          fullPath === ROUTER.ALL_PROJECTS ||
          (fullPath.startsWith("/projects") &&
            !fullPath.startsWith(ROUTER.PROJECTS_SETTINGS) &&
            !fullPath.startsWith(ROUTER.PROJECTS_INBOX)),
        show: !isCentralCompany && can(PERMISSIONS.projectManagement.list),
      },
      {
        name: t("Sidebar.UnifiedContractMakkah"),
        url: makkahUrl,
        icon: FolderClosed,
        isActive: fullPath.startsWith(makkahUrl),
        show: !isCentralCompany && can(PERMISSIONS.projectManagement.list),
      },
      {
        name: t("Sidebar.UnifiedContractJeddah"),
        url: jeddahUrl,
        icon: FolderClosed,
        isActive: fullPath.startsWith(jeddahUrl),
        show: !isCentralCompany && can(PERMISSIONS.projectManagement.list),
      },
      {
        name: t("Sidebar.Inbox"),
        url: ROUTER.PROJECTS_INBOX,
        icon: InboxIconWithCount,
        isActive: fullPath.startsWith(ROUTER.PROJECTS_INBOX),
        show: !isCentralCompany && can(PERMISSIONS.projectManagement.list),
      },
      {
        name: t("Sidebar.WorkPanelSettings"),
        url: ROUTER.WORK_PANEL_SETTINGS,
        icon: SettingsIcon,
        isActive:
          fullPath.startsWith(ROUTER.WORK_PANEL_SETTINGS) ||
          fullPath.startsWith(ROUTER.PROJECTS_SETTINGS),
        show: !isCentralCompany && can(PERMISSIONS.projectType.list),
      },
    ],
  };
}
