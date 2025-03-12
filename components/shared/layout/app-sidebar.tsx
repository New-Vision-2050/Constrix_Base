"use client";

import * as React from "react";
import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";
import { NavCompanies } from "@/components/shared/layout/nav-companies";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import CompaniesIcon from "@/public/icons/companies";
import UserIcon from "@/public/icons/user";
import SidebarHeaderContent from "./sidebar-header-content";
import SidebarFooterContent from "./sidebar-footer-content";
import { useLocale } from "next-intl";

// This is sample data.
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
      name: "الشركات",
      url: "#",
      icon: CompaniesIcon,
    },
    {
      name: "المستخدمين",
      url: "#",
      icon: UserIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  
  // For RTL languages like Arabic, the sidebar should be on the right
  // For LTR languages like English, the sidebar should be on the left
  const sidebarSide = isRtl ? "right" : "left";
  
  return (
    <Sidebar collapsible="icon" side={sidebarSide} {...props}>
      <SidebarHeader className="pt-10">
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
