import { BarChart3, LayoutDashboardIcon, UserIcon } from "lucide-react";
import SettingsIcon from "@/public/icons/settings";
import HrInboxIconWithCount from "@/components/icons/hr-inbox";
import { ROUTER } from "@/router";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Project } from "@/types/sidebar-menu";
import { SidebarProjectProps } from "./types";

/** Exact or nested match for sidebar selection (same idea as CRM / work-panel). */
function matchesRoute(fullPath: string, route: string) {
  return fullPath === route || fullPath.startsWith(`${route}/`);
}

export function getHumanResourcesProject({
  t,
  fullPath,
  can,
  isCentralCompany,
}: SidebarProjectProps): Project {
  const hrRoutes = [
    ROUTER.WORK_PANEL,
    ROUTER.HR_INBOX,
    ROUTER.Organizational_Structure,
    ROUTER.AttendanceDeparture,
    ROUTER.HR_REPORTS,
    ROUTER.HR_SETTINGS,
  ];

  return {
    name: t("Sidebar.HumanResources"),
    icon: LayoutDashboardIcon,
    urls: [
      ROUTER.WORK_PANEL,
      ROUTER.HR_INBOX,
      ROUTER.Organizational_Structure,
      ROUTER.AttendanceDeparture,
      ROUTER.HR_REPORTS,
      ROUTER.HR_SETTINGS,
    ],
    isActive: hrRoutes.some((route) => matchesRoute(fullPath, route)),
    slug: SUPER_ENTITY_SLUG.HRM,
    show: !isCentralCompany,
    sub_entities: [
      {
        name: t("WorkPanel.title"),
        url: ROUTER.WORK_PANEL,
        icon: LayoutDashboardIcon,
        isActive: matchesRoute(fullPath, ROUTER.WORK_PANEL),
        show:
          !isCentralCompany &&
          can([
            PERMISSIONS.humanResources.charts.view,
            PERMISSIONS.humanResources.procedures.view,
            PERMISSIONS.humanResources.services.view,
          ]),
      },
      {
        name: t("Sidebar.Inbox"),
        url: ROUTER.HR_INBOX,
        icon: HrInboxIconWithCount,
        isActive: matchesRoute(fullPath, ROUTER.HR_INBOX),
        show:
          !isCentralCompany &&
          can([
            PERMISSIONS.humanResources.charts.view,
            PERMISSIONS.humanResources.procedures.view,
            PERMISSIONS.humanResources.services.view,
          ]),
      },
      {
        name: t("Sidebar.OrganizationalStructure"),
        url: ROUTER.Organizational_Structure,
        icon: LayoutDashboardIcon,
        isActive: matchesRoute(fullPath, ROUTER.Organizational_Structure),
        show:
          !isCentralCompany &&
          can([
            PERMISSIONS.organization.branch.view,
            PERMISSIONS.organization.department.view,
            PERMISSIONS.organization.jobTitle.list,
            PERMISSIONS.organization.jobType.list,
            PERMISSIONS.organization.management.view,
            PERMISSIONS.organization.users.view,
          ]),
      },
      {
        name: t("Sidebar.AttendanceDeparture"),
        url: ROUTER.AttendanceDeparture,
        icon: UserIcon,
        isActive: matchesRoute(fullPath, ROUTER.AttendanceDeparture),
        show:
          !isCentralCompany &&
          can([PERMISSIONS.attendance.attendance_departure.view]),
      },
      {
        name: t("Sidebar.Reports"),
        url: ROUTER.HR_REPORTS,
        icon: BarChart3,
        isActive: matchesRoute(fullPath, ROUTER.HR_REPORTS),
        show:
          !isCentralCompany &&
          can([
            PERMISSIONS.humanResources.charts.view,
            PERMISSIONS.humanResources.procedures.view,
            PERMISSIONS.humanResources.services.view,
          ]),
      },
      {
        name: t("Sidebar.HRSettings"),
        url: ROUTER.HR_SETTINGS,
        icon: SettingsIcon,
        isActive: matchesRoute(fullPath, ROUTER.HR_SETTINGS),
        show: !isCentralCompany && can([PERMISSIONS.attendance.settings.view]),
      },
    ],
  };
}
