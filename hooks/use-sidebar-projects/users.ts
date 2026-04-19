import { UserIcon } from "lucide-react";
import { ROUTER } from "@/router";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Project } from "@/types/sidebar-menu";
import { SidebarProjectProps } from "./types";

export function getUsersProject({
  t,
  pageName,
  can,
  isCentralCompany,
}: SidebarProjectProps): Project {
  return {
    name: t("Sidebar.Users"),
    icon: UserIcon,
    urls: [ROUTER.USERS],
    isActive: pageName === ROUTER.USERS,
    slug: SUPER_ENTITY_SLUG.USERS,
    show: isCentralCompany,
    sub_entities: [
      {
        name: t("Sidebar.UsersList"),
        url: ROUTER.USERS,
        icon: UserIcon,
        isActive: pageName === ROUTER.USERS,
        show: isCentralCompany && can(Object.values(PERMISSIONS.user.list)),
      },
    ],
  };
}
