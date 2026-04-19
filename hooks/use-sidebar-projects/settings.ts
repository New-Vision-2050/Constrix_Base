import { LayoutDashboardIcon, RollerCoasterIcon, UserIcon } from "lucide-react";
import SettingsIcon from "@/public/icons/settings";
import InboxIcon from "@/public/icons/inbox-icon";
import ClipboardClockIcon from "@/public/icons/clipboard-clock";
import { ROUTER } from "@/router";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Project } from "@/types/sidebar-menu";
import { SidebarProjectProps } from "./types";

export function getSettingsProject({
  t,
  pageName,
  can,
  userProfileUrl,
}: SidebarProjectProps): Project {
  const settingsRoutesNames = [
    ROUTER.SETTINGS,
    ROUTER.DASHBOARD,
    ROUTER.CLIENT_PROFILE,
    ROUTER.USER_PROFILE,
    ROUTER.COMPANY_PROFILE,
  ];

  const rolesObj = {
    name: t("Sidebar.Roles"),
    url: ROUTER.ROLES,
    icon: RollerCoasterIcon,
    isActive: pageName === ROUTER.ROLES,
    show: can(Object.values(PERMISSIONS.role)),
  };

  const permissionsObj = {
    name: t("Sidebar.Powers"),
    url: ROUTER.PERMISSIONS,
    icon: LayoutDashboardIcon,
    isActive: pageName === ROUTER.PERMISSIONS,
    show: can(Object.values(PERMISSIONS.permission)),
  };

  return {
    name: t("Sidebar.Settings"),
    icon: SettingsIcon,
    isActive: settingsRoutesNames.indexOf(pageName) !== -1,
    slug: SUPER_ENTITY_SLUG.SETTINGS,
    urls: [userProfileUrl, ROUTER.COMPANY_PROFILE, ROUTER.SETTINGS],
    show: true,
    sub_entities: [
      {
        name: t("Sidebar.UserProfileSettings"),
        url: userProfileUrl,
        icon: UserIcon,
        isActive: pageName === userProfileUrl,
        show: can([
          ...Object.values(PERMISSIONS.userProfile).flatMap((p) =>
            Object.values(p),
          ),
          ...Object.values(PERMISSIONS.profile).flatMap((p) =>
            Object.values(p),
          ),
        ]),
      },
      {
        name: t("Sidebar.DashboardSettings"),
        url: ROUTER.COMPANY_PROFILE,
        icon: InboxIcon,
        isActive: pageName === ROUTER.COMPANY_PROFILE,
        show: can(
          Object.values(PERMISSIONS.companyProfile).flatMap((p) =>
            Object.values(p),
          ),
        ),
      },
      {
        name: t("Sidebar.SystemSettings"),
        url: ROUTER.SETTINGS,
        icon: InboxIcon,
        isActive: pageName === ROUTER.SETTINGS,
        show: can([
          PERMISSIONS.identifier.list,
          PERMISSIONS.loginWay.list,
          PERMISSIONS.driver.view,
        ]),
      },
      {
        name: t("Sidebar.ActivitiesLogs"),
        url: ROUTER.ACTIVITIES_LOGS,
        icon: ClipboardClockIcon,
        isActive: pageName === ROUTER.ACTIVITIES_LOGS,
        show: can([PERMISSIONS.activityLogs.list]),
      },
      rolesObj,
      permissionsObj,
    ],
  };
}
