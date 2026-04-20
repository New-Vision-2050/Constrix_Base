import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
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

    if (project.slug === SUPER_ENTITY_SLUG.CRM) {
      return {
        ...project,
        ...restMenuProps,
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
