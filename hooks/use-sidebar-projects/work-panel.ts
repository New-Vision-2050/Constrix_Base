import { LayoutDashboardIcon, FolderClosed } from "lucide-react";
import SettingsIcon from "@/public/icons/settings";
import InboxIconWithCount from "@/components/icons/inbox";
import { ROUTER } from "@/router";
import { Project } from "@/types/sidebar-menu";
import { SidebarProjectProps } from "./types";

export function getWorkPanelProject({
  t,
  fullPath,
  isCentralCompany,
}: SidebarProjectProps): Project {
  return {
    name: t("Sidebar.WorkPanel"),
    urls: [
      ROUTER.WORK_PANEL_SETTINGS,
      ROUTER.PROJECTS_SETTINGS,
      ROUTER.ALL_PROJECTS,
      ROUTER.PROJECTS_INBOX,
    ],
    icon: LayoutDashboardIcon,
    isActive:
      fullPath.startsWith(ROUTER.WORK_PANEL_SETTINGS) ||
      fullPath.startsWith(ROUTER.ALL_PROJECTS),
    slug: "work-panel",
    show: !isCentralCompany,
    sub_entities: [
      {
        name: t("Sidebar.WorkPanelSettings"),
        url: ROUTER.WORK_PANEL_SETTINGS,
        icon: SettingsIcon,
        isActive:
          fullPath.startsWith(ROUTER.WORK_PANEL_SETTINGS) ||
          fullPath.startsWith(ROUTER.PROJECTS_SETTINGS),
        show: !isCentralCompany,
      },
      {
        name: t("Sidebar.Projects"),
        url: ROUTER.ALL_PROJECTS,
        icon: FolderClosed,
        isActive:
          fullPath.startsWith("/projects") &&
          !fullPath.startsWith(ROUTER.PROJECTS_SETTINGS) &&
          !fullPath.startsWith(ROUTER.PROJECTS_INBOX),
        show: !isCentralCompany,
      },
      {
        name: t("Sidebar.Inbox"),
        url: ROUTER.PROJECTS_INBOX,
        icon: InboxIconWithCount,
        isActive: fullPath.startsWith(ROUTER.PROJECTS_INBOX),
        show: !isCentralCompany,
      },
    ],
  };
}
