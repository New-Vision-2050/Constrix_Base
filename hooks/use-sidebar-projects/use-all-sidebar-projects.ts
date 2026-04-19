"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@i18n/navigation";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { useSidebarMenu } from "@/hooks/useSidebarMenu";
import { UserRoleType } from "@/app/[locale]/(main)/client-profile/[id]/types";
import { Project } from "@/types/sidebar-menu";
import { useSidebarProjects } from "./index";
import { getPathnameWithoutLocale } from "./utils";
import { mergeProjects } from "./merge-projects";

export interface FinalSidebarProjectsResult {
  projects: Project[];
  isLoading: boolean;
  hasData: boolean;
}

export function useFinalSidebarProjects(
  userTypes: UserRoleType[],
): FinalSidebarProjectsResult {
  const t = useTranslations();
  const path = usePathname();
  const { can, isCentralCompany, isSuperAdmin } = usePermissions();
  const { isLoading, data } = useSidebarMenu();
  const sidebarProjects = useSidebarProjects(userTypes);

  const pageName = "/" + path.split("/").at(-1);
  const fullPath = getPathnameWithoutLocale(path);

  const projects = React.useMemo((): Project[] => {
    if (isLoading || !data) return [];

    const merged = mergeProjects(sidebarProjects, data, {
      isSuperAdmin,
      can,
      t,
      pageName,
      fullPath,
      isCentralCompany,
    });

    return merged
      .filter((project) => project.show)
      .filter((project) =>
        project.sub_entities?.some((subEntity) => subEntity.show),
      );
  }, [
    sidebarProjects,
    isLoading,
    data,
    isSuperAdmin,
    can,
    t,
    pageName,
    fullPath,
    isCentralCompany,
  ]);

  return { projects, isLoading, hasData: Boolean(data) };
}
