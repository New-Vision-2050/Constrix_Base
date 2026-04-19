import { Settings, FileText } from "lucide-react";
import CrmInboxIconWithCount from "@/components/icons/crm-inbox";
import { ROUTER } from "@/router";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { createPermissions } from "@/lib/permissions/permission-names/default-permissions";
import { Entity, Menu, Project } from "@/types/sidebar-menu";
import { CanFn, TranslationFn } from "./types";

export interface MergeProjectsOpts {
  isSuperAdmin: boolean;
  can: CanFn;
  t: TranslationFn;
  pageName: string;
  fullPath: string;
  isCentralCompany: boolean;
}

export function mergeProjects(
  projects: Project[],
  menu: Menu[],
  opts: MergeProjectsOpts,
): Project[] {
  const { isSuperAdmin, can, t, pageName, fullPath, isCentralCompany } = opts;

  return projects.map((project) => {
    if (project.slug === SUPER_ENTITY_SLUG.SETTINGS) {
      if (!isSuperAdmin) {
        return project;
      }
    }

    const matchedMenu = menu.find((menuItem) => menuItem.slug === project.slug);

    if (!matchedMenu) return project;

    const { sub_entities: menuSubEntities, ...restMenuProps } = matchedMenu;

    const transformedMenuSubEntities =
      menuSubEntities?.map(
        (menuSubEntity): Entity => ({
          name: menuSubEntity.name,
          icon: menuSubEntity.icon,
          slug: menuSubEntity.slug,
          origin_super_entity: menuSubEntity.origin_super_entity,
          url: `/${project.slug}/${menuSubEntity.slug}`,
          show: can((permissions) =>
            permissions.some(
              (permission) =>
                permission.key ===
                createPermissions(`DYNAMIC.${menuSubEntity.slug}`, ["LIST"])
                  .list,
            ),
          ),
        }),
      ) || [];

    if (project.slug === SUPER_ENTITY_SLUG.CRM) {
      return {
        ...project,
        ...restMenuProps,
        sub_entities: [
          ...transformedMenuSubEntities,
          {
            name: t("Sidebar.ClientRequests"),
            url: ROUTER.CRM.clientRequests,
            icon: FileText,
            isActive: fullPath === ROUTER.CRM.clientRequests,
            show: !isCentralCompany,
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
            isActive: pageName === ROUTER.CRM.settings,
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

    return {
      ...project,
      ...restMenuProps,
      sub_entities: [
        ...(project.sub_entities || []),
        ...transformedMenuSubEntities,
      ],
    };
  });
}
