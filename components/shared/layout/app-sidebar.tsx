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
  return (
    <Sidebar collapsible="icon" side="right" {...props}>
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
