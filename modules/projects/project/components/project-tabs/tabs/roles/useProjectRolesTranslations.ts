"use client";

import { useTranslations } from "next-intl";

/** Namespace for project tab → Roles & Permissions (see `messages/groups/projects/index.ts` → `roles`). */
export const PROJECT_ROLES_NAMESPACE = "project.roles" as const;

export function useProjectRolesTranslations() {
  return useTranslations(PROJECT_ROLES_NAMESPACE);
}
