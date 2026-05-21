import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import { createPermissions } from "@/lib/permissions/permission-names/default-permissions";
import { ROUTER } from "@/router";
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

/**
 * Sidebar merge appends dynamic sub-entities after static ones. Program settings URLs
 * (HR / CRM / projects) must render after those dynamic rows so «Settings» stays last.
 */
const SETTINGS_ROUTES_ALWAYS_LAST = [
  ROUTER.HR_SETTINGS,
  ROUTER.WORK_PANEL_SETTINGS,
  ROUTER.PROJECTS_SETTINGS,
  ROUTER.CRM.settings,
];

function matchesSettingsDeferRoute(url: string | undefined): boolean {
  if (url == null || url === "") return false;
  return SETTINGS_ROUTES_ALWAYS_LAST.some(
    (prefix) => url === prefix || url.startsWith(`${prefix}/`),
  );
}

/** Split static sub-entities into [non-settings-first, settings-last]. */
function partitionStaticSubEntitiesSettingsLast(
  entities: Entity[],
): [Entity[], Entity[]] {
  const before: Entity[] = [];
  const settingsTail: Entity[] = [];
  for (const e of entities) {
    if (matchesSettingsDeferRoute(e.url)) settingsTail.push(e);
    else before.push(e);
  }
  return [before, settingsTail];
}

export function mergeProjects(
  projects: Project[],
  menu: Menu[],
  opts: MergeProjectsOpts,
): Project[] {
  const { isSuperAdmin, can } = opts;

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

    const staticEntities = project.sub_entities || [];
    const [staticBeforeSettings, settingsStaticTail] =
      partitionStaticSubEntitiesSettingsLast(staticEntities);

    return {
      ...project,
      ...restMenuProps,
      sub_entities: [
        ...staticBeforeSettings,
        ...transformedMenuSubEntities,
        ...settingsStaticTail,
      ],
    };
  });
}
