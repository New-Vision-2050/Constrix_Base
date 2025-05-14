import { useMemo } from "react";
import { useSidebarStore } from "@/store/useSidebarStore";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import {
  Entity,
  MainProgram,
} from "@/modules/program-settings/users-settings/types/entity";

type ValueOf<T> = T[keyof T];
type SuperEntitySlug = ValueOf<typeof SUPER_ENTITY_SLUG>;

export const useGetSubEntity = (
  superEntitySlug: SuperEntitySlug,
  subEntitySlug: string
) => {
  const menu = useSidebarStore((s) => s.menu);

  return useMemo(() => {
    const superEntity = menu.find((entity) => entity.slug === superEntitySlug);
    if (!superEntity) return { superEntity: null, subEntity: null };

    const subEntity: Entity = superEntity.sub_entities?.find(
      (sub: MainProgram) => sub.slug === subEntitySlug
    );

    return { superEntity, subEntity: subEntity || null };
  }, [menu, superEntitySlug, subEntitySlug]);
};
