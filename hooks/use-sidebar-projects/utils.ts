import type { Project } from "@/types/sidebar-menu";

export function getFirstVisibleSubEntity(project: Project | undefined) {
  return project?.sub_entities?.find((s) => s.show);
}

export function getPathnameWithoutLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && segments[0].length === 2) {
    return "/" + segments.slice(1).join("/");
  }
  return pathname;
}
