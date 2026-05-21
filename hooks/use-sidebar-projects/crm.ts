import {
  LayoutDashboardIcon,
  FileText,
  Settings,
  UserCog,
  Users,
} from "lucide-react";
import { ROUTER } from "@/router";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Project } from "@/types/sidebar-menu";
import { SidebarProjectProps } from "./types";
import CrmInboxIconWithCount from "@/components/icons/crm-inbox";

/** Paths under `/crm-settings/*` that belong to other sidebar items — never highlight Settings for these. */
const CRM_SETTINGS_NON_SETTINGS_ROUTES = [
  ROUTER.CRM.clientRequests,
  ROUTER.CRM.inbox,
] as const;

function isCrmSettingsSubProgramActive(fullPath: string): boolean {
  if (fullPath === ROUTER.CRM.settings) return true;
  const base = ROUTER.CRM.settings;
  if (!fullPath.startsWith(`${base}/`)) return false;
  return !CRM_SETTINGS_NON_SETTINGS_ROUTES.some(
    (route) => fullPath === route || fullPath.startsWith(`${route}/`),
  );
}

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
      ROUTER.CRM.pricesOffers,
      ROUTER.CRM.clientRequests,
      ROUTER.CRM.inbox,
      ROUTER.CRM.settings,
    ].some((route) => path === route || path.endsWith(route)),
    show: !isCentralCompany,
    /**
     * Sub-program order (top → bottom). Settings must stay last so it appears at the
     * bottom under `/crm-settings/*`, `/client-relations/*`, `/clients`, `/brokers`.
     */
    sub_entities: [
      {
        name: t("Sidebar.ClientRequests"),
        url: ROUTER.CRM.clientRequests,
        icon: FileText,
        isActive:
          fullPath === ROUTER.CRM.clientRequests ||
          fullPath.startsWith(`${ROUTER.CRM.clientRequests}/`),
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
        name: t("Sidebar.Inbox"),
        url: ROUTER.CRM.inbox,
        icon: CrmInboxIconWithCount,
        isActive:
          fullPath === ROUTER.CRM.inbox ||
          fullPath.startsWith(`${ROUTER.CRM.inbox}/`),
        show: !isCentralCompany && can([PERMISSIONS.clientRequest.list]),
      },
      {
        name: t("Sidebar.brokers"),
        url: ROUTER.CRM.brokers,
        icon: UserCog,
        isActive:
          fullPath === ROUTER.CRM.brokers ||
          fullPath.startsWith(`${ROUTER.CRM.brokers}/`),
        show: !isCentralCompany && can([PERMISSIONS.crm.clients.view]),
      },
      {
        name: t("Sidebar.clients"),
        url: ROUTER.CRM.clients,
        icon: Users,
        isActive:
          fullPath === ROUTER.CRM.clients ||
          fullPath.startsWith(`${ROUTER.CRM.clients}/`),
        show: !isCentralCompany && can([PERMISSIONS.crm.clients.view]),
      },
      {
        name: t("Sidebar.CRMSettings"),
        url: ROUTER.CRM.settings,
        icon: Settings,
        isActive: isCrmSettingsSubProgramActive(fullPath),
        show: !isCentralCompany && can([PERMISSIONS.crm.settings.update]),
      },
    ],
  };
}
