import { LayoutDashboardIcon } from "lucide-react";
import { ROUTER } from "@/router";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Project } from "@/types/sidebar-menu";
import { SidebarProjectProps } from "./types";

export function getCompaniesProject({
  t,
  pageName,
  can,
  isCentralCompany,
}: SidebarProjectProps): Project {
  return {
    name: t("Sidebar.Companies"),
    urls: [ROUTER.COMPANIES],
    icon: LayoutDashboardIcon,
    isActive: pageName === ROUTER.COMPANIES,
    slug: SUPER_ENTITY_SLUG.COMPANY,
    show: isCentralCompany,
    sub_entities: [
      {
        name: t("Sidebar.CompaniesList"),
        url: ROUTER.COMPANIES,
        icon: LayoutDashboardIcon,
        isActive: pageName === ROUTER.COMPANIES,
        show: isCentralCompany && can(Object.values(PERMISSIONS.company.list)),
      },
    ],
  };
}
