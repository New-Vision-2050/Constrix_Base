import { LayoutDashboardIcon, UserIcon } from "lucide-react";
import SettingsIcon from "@/public/icons/settings";
import { ROUTER } from "@/router";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Project } from "@/types/sidebar-menu";
import { SidebarProjectProps } from "./types";

export function getCmsProject({
  t,
  pageName,
  can,
  isCentralCompany,
}: SidebarProjectProps): Project {
  return {
    name: t("Sidebar.CMS.title"),
    icon: SettingsIcon,
    isActive: [
      ROUTER.CMS.CATEGORIES,
      ROUTER.CMS.ICONS,
      ROUTER.CMS.MAIN_SETTINGS,
      ROUTER.CMS.ABOUT_SETTINGS,
      ROUTER.CMS.TERMS_CONDITIONS,
      ROUTER.CMS.MAIN_DATA,
      ROUTER.CMS.FOUNDER,
      ROUTER.CMS.SERVICES,
      ROUTER.CMS.OUR_SERVICES,
      ROUTER.CMS.NEWS,
      ROUTER.CMS.THEMES,
      ROUTER.CMS.COMMUNICATION_MESSAGES,
      ROUTER.CMS.PROJECTS,
      ROUTER.CMS.THEME_SETTING,
    ].includes(pageName),
    show: !isCentralCompany,
    slug: SUPER_ENTITY_SLUG.CMS,
    urls: [
      ROUTER.CMS.CATEGORIES,
      ROUTER.CMS.ICONS,
      ROUTER.CMS.MAIN_SETTINGS,
      ROUTER.CMS.ABOUT_SETTINGS,
      ROUTER.CMS.TERMS_CONDITIONS,
      ROUTER.CMS.MAIN_DATA,
      ROUTER.CMS.FOUNDER,
      ROUTER.CMS.SERVICES,
      ROUTER.CMS.OUR_SERVICES,
      ROUTER.CMS.NEWS,
      ROUTER.CMS.PROJECTS,
      ROUTER.CMS.THEME_SETTING,
      ROUTER.CMS.THEMES,
      ROUTER.CMS.COMMUNICATION_MESSAGES,
    ],
    sub_entities: [
      {
        name: t("Sidebar.CMS.Themes"),
        url: ROUTER.CMS.THEMES,
        icon: LayoutDashboardIcon,
        isActive: pageName === ROUTER.CMS.THEMES,
        show: !isCentralCompany && can(Object.values(PERMISSIONS.CMS.themes)),
      },
      {
        name: t("Sidebar.CMS.ThemeSetting"),
        url: ROUTER.CMS.THEME_SETTING,
        icon: SettingsIcon,
        isActive: pageName === ROUTER.CMS.THEME_SETTING,
        show:
          !isCentralCompany &&
          can([
            PERMISSIONS.CMS.themeSetting.view,
            PERMISSIONS.CMS.themeSetting.update,
          ]),
      },
      {
        name: t("Sidebar.CMS.Categories"),
        url: ROUTER.CMS.CATEGORIES,
        icon: LayoutDashboardIcon,
        isActive: pageName === ROUTER.CMS.CATEGORIES,
        show:
          !isCentralCompany && can(Object.values(PERMISSIONS.CMS.categories)),
      },
      {
        name: t("Sidebar.CMS.Icons"),
        url: ROUTER.CMS.ICONS,
        icon: LayoutDashboardIcon,
        isActive: pageName === ROUTER.CMS.ICONS,
        show: !isCentralCompany && can(Object.values(PERMISSIONS.CMS.icons)),
      },
      {
        name: t("Sidebar.CMS.Services"),
        url: ROUTER.CMS.SERVICES,
        icon: LayoutDashboardIcon,
        isActive: pageName === ROUTER.CMS.SERVICES,
        show:
          !isCentralCompany &&
          can([PERMISSIONS.CMS.services.list, PERMISSIONS.CMS.services.update]),
      },
      {
        name: t("Sidebar.CMS.Projects"),
        url: ROUTER.CMS.PROJECTS,
        icon: LayoutDashboardIcon,
        isActive: pageName === ROUTER.CMS.PROJECTS,
        show: !isCentralCompany && can(Object.values(PERMISSIONS.CMS.projects)),
      },
      {
        name: t("Sidebar.CMS.News"),
        url: ROUTER.CMS.NEWS,
        icon: LayoutDashboardIcon,
        isActive: pageName === ROUTER.CMS.NEWS,
        show: !isCentralCompany && can(Object.values(PERMISSIONS.CMS.news)),
      },
      {
        name: t("Sidebar.CMS.Founder"),
        url: ROUTER.CMS.FOUNDER,
        icon: UserIcon,
        isActive: pageName === ROUTER.CMS.FOUNDER,
        show: !isCentralCompany && can(Object.values(PERMISSIONS.CMS.founder)),
      },
      {
        name: t("Sidebar.CMS.MainSettings"),
        url: ROUTER.CMS.MAIN_SETTINGS,
        icon: SettingsIcon,
        isActive: pageName === ROUTER.CMS.MAIN_SETTINGS,
        show:
          !isCentralCompany &&
          can([
            PERMISSIONS.CMS.mainSettings.view,
            PERMISSIONS.CMS.mainSettings.update,
          ]),
      },
      {
        name: t("Sidebar.CMS.CommunicationMessages"),
        url: ROUTER.CMS.COMMUNICATION_MESSAGES,
        icon: LayoutDashboardIcon,
        isActive: pageName === ROUTER.CMS.COMMUNICATION_MESSAGES,
        show:
          !isCentralCompany &&
          can(Object.values(PERMISSIONS.CMS.communicationContactMessages)),
      },
      {
        name: t("Sidebar.CMS.CommunicationSettings"),
        url: ROUTER.CMS.COMMUNICATION_SETTINGS,
        icon: SettingsIcon,
        isActive: pageName === ROUTER.CMS.COMMUNICATION_SETTINGS,
        show:
          !isCentralCompany &&
          can([
            PERMISSIONS.CMS.aboutSetting.update,
            PERMISSIONS.CMS.aboutSetting.view,
          ]),
      },
      {
        name: t("Sidebar.CMS.AboutUsPage"),
        url: ROUTER.CMS.ABOUT_SETTINGS,
        icon: SettingsIcon,
        isActive: pageName === ROUTER.CMS.ABOUT_SETTINGS,
        show:
          !isCentralCompany &&
          can([
            PERMISSIONS.CMS.aboutSetting.update,
            PERMISSIONS.CMS.aboutSetting.view,
          ]),
      },
      {
        name: t("Sidebar.CMS.OurServices"),
        url: ROUTER.CMS.OUR_SERVICES,
        icon: LayoutDashboardIcon,
        isActive: pageName === ROUTER.CMS.OUR_SERVICES,
        show:
          !isCentralCompany &&
          can([PERMISSIONS.CMS.services.list, PERMISSIONS.CMS.services.update]),
      },
      {
        name: t("Sidebar.CMS.TermsConditions"),
        url: ROUTER.CMS.TERMS_CONDITIONS,
        icon: LayoutDashboardIcon,
        isActive: pageName === ROUTER.CMS.TERMS_CONDITIONS,
        show:
          !isCentralCompany &&
          can([
            PERMISSIONS.CMS.termsConditions.view,
            PERMISSIONS.CMS.termsConditions.update,
          ]),
      },
    ],
  };
}
