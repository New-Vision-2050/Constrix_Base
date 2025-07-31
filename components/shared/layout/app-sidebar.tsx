"use client";

import * as React from "react";
import { LayoutDashboardIcon, RollerCoasterIcon, UserIcon } from "lucide-react";
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

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  isCentral: boolean;
  name?: string;
  mainLogo?: string;
}

// TODO: Add the merge logic for the sidebar projects

function mergeProjectsAndMenu(
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
    const matchedMenu = menu.find((menuItem) => menuItem.slug === project.slug);

    if (!matchedMenu) return project;

    // Extract all menu fields except sub_entities
    const { sub_entities: menuSubEntities, ...restMenuProps } = matchedMenu;

    // Transform MenuSubEntity to Entity by adding the show property
    const transformedMenuSubEntities =
      menuSubEntities?.map(
        (menuSubEntity): Entity => ({
          name: menuSubEntity.name,
          icon: menuSubEntity.icon,
          slug: menuSubEntity.slug,
          origin_super_entity: menuSubEntity.origin_super_entity,
          show: true, // Default to true, you can add custom logic here if needed
        })
      ) || [];

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
}

export function AppSidebar({ name, mainLogo, ...props }: AppSidebarProps) {
  const { menu, isLoading } = useSidebarMenu();
  const locale = useLocale();
  const t = useTranslations();
  const isRtl = locale === "ar";
  const path = usePathname();
  const pageName = "/" + path.split("/").at(-1);
  const p = usePermissions(),
    { can, isCentralCompany, isSuperAdmin } = p;
  console.log("permissions ", p);
  // For RTL languages like Arabic, the sidebar should be on the right
  // For LTR languages like English, the sidebar should be on the left
  const sidebarSide = isRtl ? "right" : "left";

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
    console.log("React.useMemo permissions", p);
    const data: Project[] = [
      // companies
      {
        name: t("Sidebar.Companies"),
        urls: [ROUTER.COMPANIES],
        icon: LayoutDashboardIcon,
        isActive: pageName === ROUTER.COMPANIES,
        slug: SUPER_ENTITY_SLUG.COMPANY,
        sub_entities: [
          {
            name: t("Sidebar.CompaniesList"),
            url: ROUTER.COMPANIES,
            icon: LayoutDashboardIcon,
            isActive: pageName === ROUTER.COMPANIES,
            show: can(Object.values(PERMISSIONS.company)),
          },
        ],
        show: isCentralCompany && can(Object.values(PERMISSIONS.company)),
      },
      // users
      {
        name: t("Sidebar.Users"),
        icon: UserIcon,
        urls: [ROUTER.USERS],
        isActive: pageName === ROUTER.USERS,
        slug: SUPER_ENTITY_SLUG.USERS,
        sub_entities: [
          {
            name: t("Sidebar.UsersList"),
            url: ROUTER.USERS,
            icon: UserIcon,
            isActive: pageName === ROUTER.USERS,
            show: can(Object.values(PERMISSIONS.user)),
          },
        ],
        show: isCentralCompany && can(Object.values(PERMISSIONS.user)),
      },
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
            show: true,
          },
          {
            name: t("Sidebar.AttendanceDeparture"),
            url: ROUTER.AttendanceDeparture,
            icon: UserIcon,
            isActive: pageName === ROUTER.AttendanceDeparture,
            show: true,
          },
          {
            name: t("Sidebar.HRSettings"),
            url: ROUTER.HR_SETTINGS,
            icon: SettingsIcon,
            isActive: pageName === ROUTER.HR_SETTINGS,
            show: true,
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
        sub_entities: [
          {
            name: t("Sidebar.Users"),
            url: ROUTER.PROGRAM_SETTINGS.USERS,
            icon: LayoutDashboardIcon,
            isActive: pageName === ROUTER.PROGRAM_SETTINGS.USERS,
            show:
              isCentralCompany &&
              can(
                Object.values(PERMISSIONS.companyAccessProgram).flatMap((p) =>
                  Object.values(p)
                )
              ),
          },
        ],
        show:
          isCentralCompany &&
          can(Object.values(PERMISSIONS.companyAccessProgram)),
      },
      // settings
      {
        name: t("Sidebar.Settings"),
        icon: SettingsIcon,
        isActive: settingsRoutesNames.indexOf(pageName) !== -1,
        slug: SUPER_ENTITY_SLUG.SETTINGS,
        urls: [ROUTER.USER_PROFILE, ROUTER.COMPANY_PROFILE, ROUTER.SETTINGS],
        show: can([
          ...Object.values(PERMISSIONS.userProfile).flatMap((p) =>
            Object.values(p)
          ),
          ...Object.values(PERMISSIONS.companyProfile).flatMap((p) =>
            Object.values(p)
          ),
          ...Object.values(PERMISSIONS.companyAccessProgram),
        ]),
        sub_entities: [
          {
            name: t("Sidebar.UserProfileSettings"),
            url: ROUTER.USER_PROFILE,
            icon: UserIcon,
            isActive: pageName === ROUTER.USER_PROFILE,
            show:
              !isCentralCompany &&
              can(
                Object.values(PERMISSIONS.userProfile).flatMap((p) =>
                  Object.values(p)
                )
              ),
          },
          {
            name: "اعداد ملف الشركة",
            url: ROUTER.COMPANY_PROFILE,
            icon: InboxIcon,
            isActive: pageName === ROUTER.COMPANY_PROFILE,
            show:
              !isCentralCompany &&
              can(
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
            show:
              !isCentralCompany &&
              can(
                Object.values(PERMISSIONS.companyAccessProgram).flatMap((p) =>
                  Object.values(p)
                )
              ),
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
        sub_entities: [
          {
            name: t("Sidebar.PackagesAndPrograms"),
            url: ROUTER.Programs,
            icon: UserIcon,
            isActive: pageName === ROUTER.Programs,
            show: can(
              Object.values(PERMISSIONS.permission).flatMap((p) =>
                Object.values(p)
              )
            ),
          },
        ],
        show:
          isCentralCompany &&
          can(
            Object.values(PERMISSIONS.permission).flatMap((p) =>
              Object.values(p)
            )
          ),
      },
    ];
  }, [isSuperAdmin, pageName, permissionsObj, rolesObj, t]);

  console.log("SidebarProjects", SidebarProjects);

  const projects = isCentral
    ? SidebarProjects.filter((ele) => ele.isNotCentral)
    : SidebarProjects.filter((ele) => !ele.isNotCentral);

    return data;
  }, [pageName, isCentralCompany, can, t, p]);

  const projects = SidebarProjects.filter((project) => project.show);
  const all = mergeProjectsAndMenu(projects, menu, isSuperAdmin);

  return (
    <Sidebar
      collapsible="icon"
      side={sidebarSide}
      {...props}
      className=" bg-sidebar"
    >
      <SidebarHeader className=" pt-10 ">
        <SidebarTrigger className="absolute top-2.5 right-3.5 left-auto rtl:right-auto rtl:left-3.5 " />
        <SidebarHeaderContent name={name} mainLogo={mainLogo} />
      </SidebarHeader>
      <SidebarContent>
        {isLoading && <div className="p-4 flex justify-center">Loading...</div>}
        <SidebarProgramsList projects={all} />
        {/* <NavCompanies projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterContent />
      </SidebarFooter>
    </Sidebar>
  );
}
