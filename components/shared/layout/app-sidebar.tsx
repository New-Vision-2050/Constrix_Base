"use client";

import * as React from "react";
import {
  LayoutDashboardIcon,
  RollerCoasterIcon,
  UserIcon,
  Users,
  Settings,
  FolderClosed,
  LibraryBig,
} from "lucide-react";
// import { NavCompanies } from "@/components/shared/layout/nav-companies";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import SidebarHeaderContent from "./sidebar-header-content";
import SidebarFooterContent from "./sidebar-footer-content";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { ROUTER } from "@/router";
import SettingsIcon from "@/public/icons/settings";
import InboxIcon from "@/public/icons/inbox-icon";
import { SidebarProgramsList } from "./sidebar-programs";
import { useSidebarMenu } from "@/hooks/useSidebarMenu";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import { Menu, Project } from "@/types/sidebar-menu";
import type { Entity } from "@/types/sidebar-menu";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { createPermissions } from "@/lib/permissions/permission-names/default-permissions";
import ClipboardClockIcon from "@/public/icons/clipboard-clock";
import { SidebarProgramsListV2 } from "./sidebar-programs-v2";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  name?: string;
  mainLogo?: string;
}

export function AppSidebar({ name, mainLogo, ...props }: AppSidebarProps) {
  const { menu, isLoading, data } = useSidebarMenu();
  const locale = useLocale();
  const t = useTranslations();
  const isRtl = locale === "ar";
  const path = usePathname();
  const pageName = "/" + path.split("/").at(-1);
  const p = usePermissions(),
    { can, isCentralCompany, isSuperAdmin } = p;
  // For RTL languages like Arabic, the sidebar should be on the right
  // For LTR languages like English, the sidebar should be on the left
  const sidebarSide = isRtl ? "right" : "left";
  const mergeProjectsAndMenu = React.useCallback(
    function (
      projects: Project[],
      menu: Menu[],
      isSuperAdmin?: boolean
    ): Project[] {
      const formatted: Project[] = projects.map((project) => {
        // check is setting project
        if (project.slug === SUPER_ENTITY_SLUG.SETTINGS) {
          if (!isSuperAdmin) {
            return project;
          }
        }
        const matchedMenu = menu.find(
          (menuItem) => menuItem.slug === project.slug
        );

        if (!matchedMenu) return project;

        // Extract all menu fields except sub_entities
        const { sub_entities: menuSubEntities, ...restMenuProps } = matchedMenu;

        // Transform MenuSubEntity to Entity by adding the show property
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
                      .list
                )
              ), // Default to true, you can add custom logic here if needed
            };
          }) || [];

        return {
          ...project,
          ...restMenuProps,
          sub_entities: [
            ...(project.sub_entities || []),
            ...transformedMenuSubEntities,
          ],
        };
      });
      return formatted;
    },
    [can]
  );

  // just users & companies & program management are not central
  const SidebarProjects: Project[] = React.useMemo(() => {
    // grouped routes in sidebar
    const settingsRoutesNames = [
      ROUTER.SETTINGS,
      ROUTER.DASHBOARD,
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

    /**
     * show calculation based on company type:
     * companies: central
     * users: central
     * human resources: not-central
     * program management: central
     * CRM: not-central
     * docs library: not-central
     * settings: both
     * powers: central
     * ecommerce: not-central
     */
    const data: Project[] = [
      // companies
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
      // users
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
      // human resources
      {
        name: t("Sidebar.HumanResources"),
        icon: LayoutDashboardIcon,
        urls: [ROUTER.Organizational_Structure],
        isActive: pageName === ROUTER.Organizational_Structure,
        slug: SUPER_ENTITY_SLUG.HRM,
        show: !isCentralCompany,
        sub_entities: [
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
      // program management
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
      // CRM
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
      // docs library
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
      // settings
      {
        name: t("Sidebar.Settings"),
        icon: SettingsIcon,
        isActive: settingsRoutesNames.indexOf(pageName) !== -1,
        slug: SUPER_ENTITY_SLUG.SETTINGS,
        urls: [ROUTER.USER_PROFILE, ROUTER.COMPANY_PROFILE, ROUTER.SETTINGS],
        show: true,
        sub_entities: [
          {
            name: t("Sidebar.UserProfileSettings"),
            url: ROUTER.USER_PROFILE,
            icon: UserIcon,
            isActive: pageName === ROUTER.USER_PROFILE,
            show: can([
              ...Object.values(PERMISSIONS.userProfile).flatMap((p) =>
                Object.values(p)
              ),
              ...Object.values(PERMISSIONS.profile).flatMap((p) =>
                Object.values(p)
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
                Object.values(p)
              )
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
      // Powers
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
      // ecommerce
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
            show: true,
          },
          {
            name: t("Sidebar.Products"),
            url: ROUTER.Products,
            icon: UserIcon,
            isActive: pageName === ROUTER.Products,
            show: true,
          },

          {
            name: t("Sidebar.Requests"),
            url: ROUTER.requests,
            icon: UserIcon,
            isActive: pageName === ROUTER.requests,
            show: true,
          },
          {
            name: t("Sidebar.Categories"),
            url: ROUTER.Categories,
            icon: UserIcon,
            isActive: pageName === ROUTER.Categories,
            show: true,
          },
          {
            name: t("Sidebar.Brands"),
            url: ROUTER.Brands,
            icon: UserIcon,
            isActive: pageName === ROUTER.Brands,
            show: true,
          },
          {
            name: t("Sidebar.Coupons"),
            url: ROUTER.Coupons,
            icon: UserIcon,
            isActive: pageName === ROUTER.Coupons,
            show: true,
          },
          {
            name: t("Sidebar.Warehouse"),
            url: ROUTER.warehouse,
            icon: UserIcon,
            isActive: pageName === ROUTER.warehouse,
            show: true,
          },
          {
            name: t("Sidebar.PagesSettings"),
            url: ROUTER.pagesSettings,
            icon: UserIcon,
            isActive: pageName === ROUTER.pagesSettings,
            show: true,
          },
          {
            name: t("Sidebar.Terms"),
            url: ROUTER.Terms,
            icon: UserIcon,
            isActive: pageName === ROUTER.Terms,
            show: true,
          },

          {
            name: t("Sidebar.SocialMedia"),
            url: ROUTER.SocialMedia,
            icon: UserIcon,
            isActive: pageName === ROUTER.SocialMedia,
            show: true,
          },
          {
            name: t("Sidebar.PaymentMethods"),
            url: ROUTER.PaymentMethods,
            icon: UserIcon,
            isActive: pageName === ROUTER.PaymentMethods,
            show: true,
          },
        ],
      },
    ];
    return data;
  }, [pageName, isCentralCompany, can, t]);

  const all = React.useMemo(() => {
    if (isLoading) return [];
    if (!Boolean(data)) return [];
    const _mergedProjects = mergeProjectsAndMenu(
      SidebarProjects,
      data,
      isSuperAdmin
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
    <Sidebar
      collapsible="icon"
      side={sidebarSide}
      {...props}
      className="dashboard-sidebar bg-sidebar"
    >
      <SidebarHeader className=" pt-10 ">
        <SidebarTrigger className="absolute top-2.5 right-3.5 left-auto rtl:right-auto rtl:left-3.5 " />
        <SidebarHeaderContent name={name} mainLogo={mainLogo} />
      </SidebarHeader>
      <SidebarContent>
        {(isLoading || !Boolean(data)) && (
          <div className="p-4 flex justify-center">Loading...</div>
        )}
        {all.length && !isLoading && <SidebarProgramsListV2 projects={all} />}
        {/* <NavCompanies projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterContent />
      </SidebarFooter>
    </Sidebar>
  );
}
