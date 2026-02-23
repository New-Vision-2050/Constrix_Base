"use client";

import * as React from "react";
import {
  LayoutDashboardIcon,
  RollerCoasterIcon,
  UserIcon,
  Settings,
  FolderClosed,
  LibraryBig,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "@i18n/navigation";
import { ROUTER } from "@/router";
import SettingsIcon from "@/public/icons/settings";
import InboxIcon from "@/public/icons/inbox-icon";
import { useSidebarMenu } from "@/hooks/useSidebarMenu";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import { Menu, Project } from "@/types/sidebar-menu";
import type { Entity } from "@/types/sidebar-menu";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { createPermissions } from "@/lib/permissions/permission-names/default-permissions";
import ClipboardClockIcon from "@/public/icons/clipboard-clock";
import { SidebarProgramsListV2 } from "./sidebar-programs-v2";
import { UserRoleType } from "@/app/[locale]/(main)/client-profile/[id]/types";
import { UsersRole } from "@/constants/users-role.enum";
import SidebarFooterContent from "./sidebar-footer-content";
import { AvatarGroup } from "../avatar-group";
import { useAuthStore } from "@/modules/auth/store/use-auth";
import Image from "next/image";
import LogoPlaceholder from "@/public/images/logo-placeholder-image.png";

interface SidebarContentWrapperProps {
  name?: string;
  mainLogo?: string;
  userTypes: UserRoleType[];
  showHeader?: boolean;
  showFooter?: boolean;
}

export function SidebarContentWrapper({
  name,
  mainLogo,
  userTypes,
  showHeader = true,
  showFooter = true,
}: SidebarContentWrapperProps) {
  const { isLoading, data } = useSidebarMenu();
  const t = useTranslations();
  const path = usePathname();
  const pageName = "/" + path.split("/").at(-1);
  const p = usePermissions(),
    { can, isCentralCompany, isSuperAdmin } = p;
  const user = useAuthStore((state) => state.user);

  const userProfileUrl = React.useMemo(() => {
    const isEmployee = userTypes.some(
      (userType) => userType.role == UsersRole.Employee,
    );
    const isBroker = userTypes.some(
      (userType) => userType.role == UsersRole.Broker,
    );
    const isClient = userTypes.some(
      (userType) => userType.role == UsersRole.Client,
    );
    if (userTypes.length > 0) {
      if (isEmployee) {
        return ROUTER.USER_PROFILE;
      } else if (isBroker || isClient) {
        return ROUTER.CLIENT_PROFILE;
      }
    }
    return `${ROUTER.CLIENT_PROFILE}?readonly=true`;
  }, [userTypes]);

  const mergeProjectsAndMenu = React.useCallback(
    function (
      projects: Project[],
      menu: Menu[],
      isSuperAdmin?: boolean,
    ): Project[] {
      const formatted: Project[] = projects.map((project) => {
        if (project.slug === SUPER_ENTITY_SLUG.SETTINGS) {
          if (!isSuperAdmin) {
            return project;
          }
        }
        const matchedMenu = menu.find(
          (menuItem) => menuItem.slug === project.slug,
        );

        if (!matchedMenu) return project;

        const { sub_entities: menuSubEntities, ...restMenuProps } = matchedMenu;

        const transformedMenuSubEntities =
          menuSubEntities?.map((menuSubEntity): Entity => {
            return {
              name: menuSubEntity.name,
              icon: menuSubEntity.icon,
              slug: menuSubEntity.slug,
              origin_super_entity: menuSubEntity.origin_super_entity,
              url: `/${project.slug}/${menuSubEntity.slug}`,
              show: can((permissions) =>
                permissions.some(
                  (permission) =>
                    permission.key ===
                    createPermissions(`DYNAMIC.${menuSubEntity.slug}`, ["LIST"])
                      .list,
                ),
              ),
            };
          }) || [];

        return {
          ...project,
          ...restMenuProps,
          sub_entities: [
            ...transformedMenuSubEntities,
            ...(project.sub_entities || []),
          ],
        };
      });
      return formatted;
    },
    [can],
  );

  const SidebarProjects: Project[] = React.useMemo(() => {
    const settingsRoutesNames = [
      ROUTER.SETTINGS,
      ROUTER.DASHBOARD,
      ROUTER.CLIENT_PROFILE,
      ROUTER.USER_PROFILE,
      ROUTER.COMPANY_PROFILE,
    ];
    const rolesObj = {
      name: "الادوار",
      url: ROUTER.ROLES,
      icon: RollerCoasterIcon,
      isActive: pageName === ROUTER.ROLES,
      show: can(Object.values(PERMISSIONS.role)),
    };

    const permissionsObj = {
      name: "الصلاحيات",
      url: ROUTER.PERMISSIONS,
      icon: LayoutDashboardIcon,
      isActive: pageName === ROUTER.PERMISSIONS,
      show: can(Object.values(PERMISSIONS.permission)),
    };

    const data: Project[] = [
      {
        name: t("Sidebar.CRM"),
        slug: SUPER_ENTITY_SLUG.CRM,
        icon: LayoutDashboardIcon,
        urls: [ROUTER.CRM.clients, ROUTER.CRM.brokers, ROUTER.CRM.settings],
        isActive: pageName === ROUTER.CRM.clients,
        show: !isCentralCompany,
        sub_entities: [
          {
            name: t("Sidebar.CRMSettings"),
            url: ROUTER.CRM.settings,
            icon: Settings,
            isActive: pageName === ROUTER.CRM.settings,
            show: !isCentralCompany && can([PERMISSIONS.crm.settings.update]),
          },
        ],
      },
      {
        name: t("Sidebar.Companies"),
        urls: [ROUTER.COMPANIES],
        icon: LayoutDashboardIcon,
        isActive: pageName === ROUTER.COMPANIES,
        slug: SUPER_ENTITY_SLUG.COMPANY,
        show: isCentralCompany,
        sub_entities: [
          {
            name: t("Sidebar.CompaniesList"),
            url: ROUTER.COMPANIES,
            icon: LayoutDashboardIcon,
            isActive: pageName === ROUTER.COMPANIES,
            show:
              isCentralCompany && can(Object.values(PERMISSIONS.company.list)),
          },
        ],
      },
      {
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
      },
      {
        name: t("Sidebar.HumanResources"),
        icon: LayoutDashboardIcon,
        urls: [ROUTER.Organizational_Structure, ROUTER.WORK_PANEL],
        isActive: pageName === ROUTER.Organizational_Structure,
        slug: SUPER_ENTITY_SLUG.HRM,
        show: !isCentralCompany,
        sub_entities: [
          {
            name: t("WorkPanel.title"),
            url: ROUTER.WORK_PANEL,
            icon: LayoutDashboardIcon,
            isActive: pageName === ROUTER.WORK_PANEL,
            show: !isCentralCompany,
          },
          {
            name: t("Sidebar.OrganizationalStructure"),
            url: ROUTER.Organizational_Structure,
            icon: LayoutDashboardIcon,
            isActive: pageName === ROUTER.Organizational_Structure,
            show:
              !isCentralCompany &&
              can([
                PERMISSIONS.organization.branch.view,
                PERMISSIONS.organization.department.view,
                PERMISSIONS.organization.jobTitle.list,
                PERMISSIONS.organization.jobType.list,
                PERMISSIONS.organization.management.view,
                PERMISSIONS.organization.users.view,
              ]),
          },
          {
            name: t("Sidebar.AttendanceDeparture"),
            url: ROUTER.AttendanceDeparture,
            icon: UserIcon,
            isActive: pageName === ROUTER.AttendanceDeparture,
            show:
              !isCentralCompany &&
              can([PERMISSIONS.attendance.attendance_departure.view]),
          },
          {
            name: t("Sidebar.HRSettings"),
            url: ROUTER.HR_SETTINGS,
            icon: SettingsIcon,
            isActive: pageName === ROUTER.HR_SETTINGS,
            show:
              !isCentralCompany && can([PERMISSIONS.attendance.settings.view]),
          },
        ],
      },
      {
        name: t("Sidebar.ProgramManagement"),
        slug: SUPER_ENTITY_SLUG.PM,
        icon: LayoutDashboardIcon,
        urls: [ROUTER.PROGRAM_SETTINGS.USERS],
        isActive: pageName === ROUTER.PROGRAM_SETTINGS.USERS,
        show: isCentralCompany,
        sub_entities: [
          {
            name: t("Sidebar.Users"),
            url: ROUTER.PROGRAM_SETTINGS.USERS,
            icon: LayoutDashboardIcon,
            isActive: pageName === ROUTER.PROGRAM_SETTINGS.USERS,
            show: isCentralCompany && can(Object.values(PERMISSIONS.subEntity)),
          },
        ],
      },
      {
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
      },
      {
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
            name: "اعداد ملف الشركة",
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
      },
      {
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
      },
      {
        name: t("Sidebar.ecommerce"),
        icon: SettingsIcon,
        isActive: [
          ROUTER.HomeStore,
          ROUTER.Products,
          ROUTER.Brands,
          ROUTER.Categories,
          ROUTER.Terms,
          ROUTER.warehouse,
          ROUTER.Discounts,
          ROUTER.Coupons,
        ].includes(pageName),
        show: !isCentralCompany,
        slug: SUPER_ENTITY_SLUG.ECOMMERCE,
        urls: [
          ROUTER.HomeStore,
          ROUTER.Products,
          ROUTER.Brands,
          ROUTER.Categories,
          ROUTER.Terms,
          ROUTER.warehouse,
          ROUTER.Discounts,
          ROUTER.Coupons,
          ROUTER.PaymentMethods,
        ],
        sub_entities: [
          {
            name: t("Sidebar.HomeStore"),
            url: ROUTER.HomeStore,
            icon: UserIcon,
            isActive: pageName === ROUTER.HomeStore,
            show:
              !isCentralCompany &&
              can(Object.values(PERMISSIONS.ecommerce.dashboard)),
          },
          {
            name: t("Sidebar.Products"),
            url: ROUTER.Products,
            icon: UserIcon,
            isActive: pageName === ROUTER.Products,
            show:
              !isCentralCompany &&
              can(Object.values(PERMISSIONS.ecommerce.product)),
          },
          {
            name: t("Sidebar.Requests"),
            url: ROUTER.requests,
            icon: UserIcon,
            isActive: pageName === ROUTER.requests,
            show:
              !isCentralCompany &&
              can(Object.values(PERMISSIONS.ecommerce.order)),
          },
          {
            name: t("Sidebar.Categories"),
            url: ROUTER.Categories,
            icon: UserIcon,
            isActive: pageName === ROUTER.Categories,
            show:
              !isCentralCompany &&
              can(Object.values(PERMISSIONS.ecommerce.category)),
          },
          {
            name: t("Sidebar.Brands"),
            url: ROUTER.Brands,
            icon: UserIcon,
            isActive: pageName === ROUTER.Brands,
            show:
              !isCentralCompany &&
              can(Object.values(PERMISSIONS.ecommerce.brand)),
          },
          {
            name: t("Sidebar.Coupons"),
            url: ROUTER.Coupons,
            icon: UserIcon,
            isActive: pageName === ROUTER.Coupons,
            show:
              !isCentralCompany &&
              can([
                PERMISSIONS.ecommerce.coupon.list,
                PERMISSIONS.ecommerce.featureDeal.list,
                PERMISSIONS.ecommerce.flashDeal.list,
                PERMISSIONS.ecommerce.dealDay.list,
              ]),
          },
          {
            name: t("Sidebar.Warehouse"),
            url: ROUTER.warehouse,
            icon: UserIcon,
            isActive: pageName === ROUTER.warehouse,
            show:
              !isCentralCompany &&
              can(Object.values(PERMISSIONS.ecommerce.warehouse)),
          },
          {
            name: t("Sidebar.PagesSettings"),
            url: ROUTER.pagesSettings,
            icon: UserIcon,
            isActive: pageName === ROUTER.pagesSettings,
            show:
              !isCentralCompany &&
              can(Object.values(PERMISSIONS.ecommerce.banner)),
          },
          {
            name: t("Sidebar.Terms"),
            url: ROUTER.Terms,
            icon: UserIcon,
            isActive: pageName === ROUTER.Terms,
            show:
              !isCentralCompany &&
              can(Object.values(PERMISSIONS.ecommerce.page)),
          },
          {
            name: t("Sidebar.SocialMedia"),
            url: ROUTER.SocialMedia,
            icon: UserIcon,
            isActive: pageName === ROUTER.SocialMedia,
            show:
              !isCentralCompany &&
              can(Object.values(PERMISSIONS.ecommerce.socialMedia)),
          },
          {
            name: t("Sidebar.PaymentMethods"),
            url: ROUTER.PaymentMethods,
            icon: UserIcon,
            isActive: pageName === ROUTER.PaymentMethods,
            show:
              !isCentralCompany &&
              can(Object.values(PERMISSIONS.ecommerce.paymentMethod)),
          },
        ],
      },
      {
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
            show:
              !isCentralCompany && can(Object.values(PERMISSIONS.CMS.themes)),
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
              !isCentralCompany &&
              can(Object.values(PERMISSIONS.CMS.categories)),
          },
          {
            name: t("Sidebar.CMS.Icons"),
            url: ROUTER.CMS.ICONS,
            icon: LayoutDashboardIcon,
            isActive: pageName === ROUTER.CMS.ICONS,
            show:
              !isCentralCompany && can(Object.values(PERMISSIONS.CMS.icons)),
          },
          {
            name: t("Sidebar.CMS.Services"),
            url: ROUTER.CMS.SERVICES,
            icon: LayoutDashboardIcon,
            isActive: pageName === ROUTER.CMS.SERVICES,
            show:
              !isCentralCompany &&
              can([
                PERMISSIONS.CMS.services.list,
                PERMISSIONS.CMS.services.update,
              ]),
          },
          {
            name: t("Sidebar.CMS.Projects"),
            url: ROUTER.CMS.PROJECTS,
            icon: LayoutDashboardIcon,
            isActive: pageName === ROUTER.CMS.PROJECTS,
            show:
              !isCentralCompany && can(Object.values(PERMISSIONS.CMS.projects)),
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
            show:
              !isCentralCompany && can(Object.values(PERMISSIONS.CMS.founder)),
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
              can([
                PERMISSIONS.CMS.services.list,
                PERMISSIONS.CMS.services.update,
              ]),
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
      },
    ];
    return data;
  }, [pageName, isCentralCompany, can, t, userProfileUrl]);

  const all = React.useMemo(() => {
    if (isLoading) return [];
    if (!Boolean(data)) return [];
    const _mergedProjects = mergeProjectsAndMenu(
      SidebarProjects,
      data,
      isSuperAdmin,
    );
    const _shownProjects = _mergedProjects
      ?.filter((project) => {
        return project.show;
      })
      ?.filter((project) => {
        return project.sub_entities?.some((subEntity) => subEntity.show);
      });
    return _shownProjects;
  }, [SidebarProjects, isLoading, data, isSuperAdmin, mergeProjectsAndMenu]);

  return (
    <div className="flex h-full w-full flex-col bg-sidebar">
      {showHeader && (
        <div className="pt-10 px-4">
          <div className="flex items-center justify-center flex-col gap-1">
            {mainLogo ? (
              <Image
                src={mainLogo}
                alt={name || "Company Logo"}
                width={60}
                height={47}
                priority={true}
              />
            ) : (
              <Image
                src={LogoPlaceholder}
                alt={"logo placeholder"}
                width={80}
                height={47}
              />
            )}
            <p className="font-bold truncate">
              {name || t("Sidebar.CompanyName")}
            </p>
          </div>
          <div className="flex gap-5 my-5 pr-5">
            <AvatarGroup
              fullName={user?.name ?? ""}
              alt={user?.name ?? ""}
              src="https://github.com/shadcn.png"
            />
            <p className="truncate">
              {t("Sidebar.Welcome")} {user?.name}
            </p>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-auto">
        {(isLoading || !Boolean(data)) && (
          <div className="p-4 flex justify-center">Loading...</div>
        )}
        {all && all.length > 0 && !isLoading && (
          <SidebarProgramsListV2 projects={all} />
        )}
      </div>
      {showFooter && (
        <div className="p-4">
          <SidebarFooterContent />
        </div>
      )}
    </div>
  );
}
