import { LayoutDashboardIcon } from "lucide-react";
import { ROUTER } from "@/router";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Project } from "@/types/sidebar-menu";
import { SidebarProjectProps } from "./types";

export function getProgramManagementProject({
  t,
  pageName,
  can,
  isCentralCompany,
}: SidebarProjectProps): Project {
  return {
    name: t("Sidebar.ProgramManagement"),
    slug: SUPER_ENTITY_SLUG.PM,
    icon: LayoutDashboardIcon,
    urls: [ROUTER.PROGRAM_SETTINGS.USERS],
    isActive: pageName === ROUTER.PROGRAM_SETTINGS.USERS,
    show: isCentralCompany,
    sub_entities: [
      {
        name: t("Sidebar.Users"),
        url: ROUTER.PROGRAM_SETTINGS.USERS,
        icon: LayoutDashboardIcon,
        isActive: pageName === ROUTER.PROGRAM_SETTINGS.USERS,
        show: isCentralCompany && can(Object.values(PERMISSIONS.subEntity)),
      },
    ],
  };
}
