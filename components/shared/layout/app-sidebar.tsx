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
        central: false,
      },
      {
        name: t("Sidebar.Users"),
        url: ROUTER.USERS,
        icon: UserIcon,
        isActive: pageName === ROUTER.USERS,
        central: false,
      },
      {
        name: t("Sidebar.Settings"),
        url: ROUTER.SETTINGS,
        icon: SettingsIcon,
        isActive: pageName === ROUTER.SETTINGS,
        central: true,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" side={sidebarSide} {...props}>
      <SidebarHeader className=" pt-10">
        <SidebarTrigger className="absolute top-2.5 right-3.5 left-auto rtl:right-auto rtl:left-3.5 " />
        <SidebarHeaderContent name={name} mainLogo={mainLogo} />
      </SidebarHeader>
      <SidebarContent>
        <NavCompanies projects={data.projects} isCentral={isCentral} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterContent />
      </SidebarFooter>
    </Sidebar>
  );
}
