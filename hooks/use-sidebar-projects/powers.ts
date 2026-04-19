import { UserIcon } from "lucide-react";
import SettingsIcon from "@/public/icons/settings";
import { ROUTER } from "@/router";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Project } from "@/types/sidebar-menu";
import { SidebarProjectProps } from "./types";

export function getPowersProject({
  t,
  pageName,
  can,
  isCentralCompany,
}: SidebarProjectProps): Project {
  return {
    name: t("Sidebar.Powers"),
    icon: SettingsIcon,
    isActive: pageName === ROUTER.Powers,
    slug: SUPER_ENTITY_SLUG.POWERS,
    urls: [ROUTER.Programs],
    show: isCentralCompany,
    sub_entities: [
      {
        name: t("Sidebar.PackagesAndPrograms"),
        url: ROUTER.Programs,
        icon: UserIcon,
        isActive: pageName === ROUTER.Programs,
        show:
          isCentralCompany &&
          can(Object.values(PERMISSIONS.companyAccessProgram)),
      },
    ],
  };
}
