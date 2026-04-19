import { LayoutDashboardIcon, FileText } from "lucide-react";
import { ROUTER } from "@/router";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Project } from "@/types/sidebar-menu";
import { SidebarProjectProps } from "./types";

export function getCrmProject({
  t,
  path,
  fullPath,
  can,
  isCentralCompany,
}: SidebarProjectProps): Project {
  return {
    name: t("Sidebar.CRM"),
    slug: SUPER_ENTITY_SLUG.CRM,
    icon: LayoutDashboardIcon,
    urls: [
      ROUTER.CRM.clients,
      ROUTER.CRM.brokers,
      ROUTER.CRM.settings,
      ROUTER.CRM.pricesOffers,
      ROUTER.CRM.clientRequests,
      ROUTER.CRM.inbox,
    ],
    isActive: [
      ROUTER.CRM.clients,
      ROUTER.CRM.brokers,
      ROUTER.CRM.settings,
      ROUTER.CRM.pricesOffers,
      ROUTER.CRM.clientRequests,
      ROUTER.CRM.inbox,
    ].some((route) => path === route || path.endsWith(route)),
    show: !isCentralCompany,
    sub_entities: [
      {
        name: t("Sidebar.PricesOffers"),
        url: ROUTER.CRM.pricesOffers,
        icon: FileText,
        isActive: fullPath === ROUTER.CRM.pricesOffers,
        show: can([PERMISSIONS.crm.pricesOffers.list]),
      },
    ],
  };
}
