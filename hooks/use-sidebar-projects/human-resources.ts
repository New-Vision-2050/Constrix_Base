import { LayoutDashboardIcon, UserIcon } from "lucide-react";
import SettingsIcon from "@/public/icons/settings";
import { ROUTER } from "@/router";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Project } from "@/types/sidebar-menu";
import { SidebarProjectProps } from "./types";

export function getHumanResourcesProject({
  t,
  pageName,
  can,
  isCentralCompany,
}: SidebarProjectProps): Project {
  return {
    name: t("Sidebar.HumanResources"),
    icon: LayoutDashboardIcon,
    urls: [ROUTER.Organizational_Structure, ROUTER.WORK_PANEL],
    isActive: pageName === ROUTER.Organizational_Structure,
    slug: SUPER_ENTITY_SLUG.HRM,
    show: !isCentralCompany,
    sub_entities: [
      {
        name: t("WorkPanel.title"),
        url: ROUTER.WORK_PANEL,
        icon: LayoutDashboardIcon,
        isActive: pageName === ROUTER.WORK_PANEL,
        show: !isCentralCompany,
      },
      {
        name: t("Sidebar.OrganizationalStructure"),
        url: ROUTER.Organizational_Structure,
        icon: LayoutDashboardIcon,
        isActive: pageName === ROUTER.Organizational_Structure,
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
        isActive: pageName === ROUTER.AttendanceDeparture,
        show:
          !isCentralCompany &&
          can([PERMISSIONS.attendance.attendance_departure.view]),
      },
      {
        name: t("Sidebar.HRSettings"),
        url: ROUTER.HR_SETTINGS,
        icon: SettingsIcon,
        isActive: pageName === ROUTER.HR_SETTINGS,
        show: !isCentralCompany && can([PERMISSIONS.attendance.settings.view]),
      },
    ],
  };
}
