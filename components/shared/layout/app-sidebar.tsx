"use client";

import * as React from "react";
import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";
import { NavCompanies } from "@/components/shared/layout/nav-companies";
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const locale = useLocale();
  const t = useTranslations();
  const isRtl = locale === "ar";
  const path = usePathname();
  const pageName = "/" + path.split("/").at(-1);

  // For RTL languages like Arabic, the sidebar should be on the right
  // For LTR languages like English, the sidebar should be on the left
  const sidebarSide = isRtl ? "right" : "left";

  // grouped routes in sidebar
  const settingsRoutes = [
    ROUTER.SETTINGS,
    ROUTER.DASHBOARD,
    ROUTER.USER_PROFILE,
  ];

  // This is sample data with translated names
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
    projects: [
      {
        name: t("Sidebar.Companies"),
        url: ROUTER.COMPANIES,
        icon: CompaniesIcon,
        isActive: pageName === ROUTER.COMPANIES,
      },
      {
        name: t("Sidebar.Users"),
        url: ROUTER.USERS,
        icon: UserIcon,
        isActive: pageName === ROUTER.USERS,
      },
      {
        name: t("Sidebar.Settings"),
        icon: SettingsIcon,
        isActive: settingsRoutes.indexOf(pageName) !== -1,
        submenu: [
          {
            name: t("Sidebar.UserProfileSettings"),
            url: ROUTER.USER_PROFILE,
            isActive: pageName === ROUTER.USER_PROFILE,
          },
          {
            name: t("Sidebar.DashboardSettings"),
            url: ROUTER.DASHBOARD,
            isActive: pageName === ROUTER.DASHBOARD,
          },
          {
            name: t("Sidebar.SystemSettings"),
            url: ROUTER.SETTINGS,
            isActive: pageName === ROUTER.SETTINGS,
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" side={sidebarSide} {...props}>
      <SidebarHeader className=" pt-10">
        <SidebarTrigger className="absolute top-2.5 right-3.5 left-auto rtl:right-auto rtl:left-3.5 " />
        <SidebarHeaderContent />
      </SidebarHeader>
      <SidebarContent>
        <NavCompanies projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterContent />
      </SidebarFooter>
    </Sidebar>
  );
}
