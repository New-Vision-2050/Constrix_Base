import type { useTranslations } from "next-intl";
import type { usePermissions } from "@/lib/permissions/client/permissions-provider";

export type TranslationFn = ReturnType<typeof useTranslations>;
export type CanFn = ReturnType<typeof usePermissions>["can"];

export interface SidebarProjectProps {
  t: TranslationFn;
  pageName: string;
  fullPath: string;
  path: string;
  can: CanFn;
  isCentralCompany: boolean;
  userProfileUrl: string;
}
