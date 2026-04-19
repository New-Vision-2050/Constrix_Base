import { LibraryBig, FolderClosed } from "lucide-react";
import { ROUTER } from "@/router";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Project } from "@/types/sidebar-menu";
import { SidebarProjectProps } from "./types";

export function getDocsLibraryProject({
  t,
  pageName,
  can,
  isCentralCompany,
}: SidebarProjectProps): Project {
  return {
    name: t("Sidebar.docs-library"),
    slug: SUPER_ENTITY_SLUG.DOCS_LIBRARY,
    icon: LibraryBig,
    urls: [ROUTER.DOCS_LIBRARY],
    isActive: pageName === ROUTER.DOCS_LIBRARY,
    show: !isCentralCompany,
    sub_entities: [
      {
        name: t("Sidebar.docs-library-docs"),
        url: ROUTER.DOCS_LIBRARY,
        icon: FolderClosed,
        isActive: pageName === ROUTER.DOCS_LIBRARY,
        show: !isCentralCompany && can([PERMISSIONS.library.folder.list]),
      },
    ],
  };
}
