import { LayoutDashboardIcon, FileText, Settings } from "lucide-react";
import { ROUTER } from "@/router";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Project } from "@/types/sidebar-menu";
import { SidebarProjectProps } from "./types";
import CrmInboxIconWithCount from "@/components/icons/crm-inbox";

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
      {
        name: t("Sidebar.ClientRequests"),
        url: ROUTER.CRM.clientRequests,
        icon: FileText,
        isActive: fullPath === ROUTER.CRM.clientRequests,
        show: !isCentralCompany && can([PERMISSIONS.clientRequest.list]),
      },
      {
        name: t("Sidebar.PricesOffers"),
        url: ROUTER.CRM.pricesOffers,
        icon: FileText,
        isActive: fullPath === ROUTER.CRM.pricesOffers,
        show: !isCentralCompany && can([PERMISSIONS.crm.pricesOffers.list]),
      },
      {
        name: t("Sidebar.CRMSettings"),
        url: ROUTER.CRM.settings,
        icon: Settings,
        show: !isCentralCompany && can([PERMISSIONS.crm.settings.update]),
      },
      {
        name: t("Sidebar.Inbox"),
        url: ROUTER.CRM.inbox,
        icon: CrmInboxIconWithCount,
        isActive:
          fullPath === ROUTER.CRM.inbox ||
          fullPath.startsWith(`${ROUTER.CRM.inbox}/`),
        show: !isCentralCompany && can([PERMISSIONS.clientRequest.list]),
      },
    ],
  };
}
