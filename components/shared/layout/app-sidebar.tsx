"use client";

import * as React from "react";
import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";
// import { NavCompanies } from "@/components/shared/layout/nav-companies";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import CompaniesIcon from "@/public/icons/companies";
import UserIcon from "@/public/icons/user";
import SidebarHeaderContent from "./sidebar-header-content";
import SidebarFooterContent from "./sidebar-footer-content";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { ROUTER } from "@/router";
import SettingsIcon from "@/public/icons/settings";
import InboxIcon from "@/public/icons/inbox-icon";
import { SidebarProgramsList } from "./sidebar-programs";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  isCentral: boolean;
  name?: string;
  mainLogo?: string;
}

export function AppSidebar({
  isCentral,
  name,
  mainLogo,
  ...props
}: AppSidebarProps) {
  const locale = useLocale();
  const t = useTranslations();
  const isRtl = locale === "ar";
  const path = usePathname();
  const pageName = "/" + path.split("/").at(-1);

  // For RTL languages like Arabic, the sidebar should be on the right
  // For LTR languages like English, the sidebar should be on the left
  const sidebarSide = isRtl ? "right" : "left";

  // grouped routes in sidebar
  const settingsRoutesNames = [
    ROUTER.SETTINGS,
    ROUTER.DASHBOARD,
    ROUTER.USER_PROFILE,
    ROUTER.COMPANY_PROFILE,
  ];
  const settingsRoutes = {
    name: t("Sidebar.Settings"),
    icon: SettingsIcon,
    isActive: settingsRoutesNames.indexOf(pageName) !== -1,
    submenu: [
      {
        name: t("Sidebar.UserProfileSettings"),
        url: ROUTER.USER_PROFILE,
        icon: UserIcon,
        isActive: pageName === ROUTER.USER_PROFILE,
      },
      {
        name: "اعداد ملف الشركة",
        url: ROUTER.COMPANY_PROFILE,
        icon: InboxIcon,
        isActive: pageName === ROUTER.COMPANY_PROFILE,
      },
      // {
      //   name: t("Sidebar.DashboardSettings"),
      //   url: ROUTER.DASHBOARD,
      //   icon: InboxIcon,
      //   isActive: pageName === ROUTER.DASHBOARD,
      // },
      {
        name: t("Sidebar.SystemSettings"),
        url: ROUTER.SETTINGS,
        icon: InboxIcon,
        isActive: pageName === ROUTER.SETTINGS,
      },
    ],
  };

  // This is sample data with translated names

  const projects = isCentral
    ? [
        {
          name: t("Sidebar.Companies"),
          url: ROUTER.COMPANIES,
          icon: CompaniesIcon,
          isActive: pageName === ROUTER.COMPANIES,
          submenu: [
            {
              name: t("Sidebar.CompaniesList"),
              url: ROUTER.COMPANIES,
              icon: CompaniesIcon,
              isActive: pageName === ROUTER.COMPANIES,
            },
          ],
        },
        {
          name: t("Sidebar.Users"),
          icon: UserIcon,
          isActive: pageName === ROUTER.USERS,
          submenu: [
            {
              name: t("Sidebar.UsersList"),
              url: ROUTER.USERS,
              icon: UserIcon,
              isActive: pageName === ROUTER.USERS,
            },
          ],
        },
        settingsRoutes,
      ]
    : [settingsRoutes];

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    projects: [...projects],
  };

  return (
    <Sidebar
      collapsible="icon"
      side={sidebarSide}
      {...props}
      className="text-white"
    >
      <SidebarHeader className=" pt-10">
        <SidebarTrigger className="absolute top-2.5 right-3.5 left-auto rtl:right-auto rtl:left-3.5 " />
        <SidebarHeaderContent name={name} mainLogo={mainLogo} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarProgramsList projects={data.projects} />
        {/* <NavCompanies projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterContent />
      </SidebarFooter>
    </Sidebar>
  );
}
