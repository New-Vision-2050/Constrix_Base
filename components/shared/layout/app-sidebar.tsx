"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import SidebarHeaderContent from "./sidebar-header-content";
import SidebarFooterContent from "./sidebar-footer-content";
import { useLocale } from "next-intl";
import { useSidebarMenu } from "@/hooks/useSidebarMenu";
import { UserRoleType } from "@/app/[locale]/(main)/client-profile/[id]/types";
import { SidebarContentWrapper } from "./sidebar-content";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  name?: string;
  mainLogo?: string;
  userTypes: UserRoleType[];
}

export function AppSidebar({
  name,
  mainLogo,
  userTypes,
  ...props
}: AppSidebarProps) {
  const { isLoading, data } = useSidebarMenu();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const sidebarSide = isRtl ? "right" : "left";

  console.log("data101data", data);

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
        {!isLoading && Boolean(data) && (
          <SidebarContentWrapper
            name={name}
            mainLogo={mainLogo}
            userTypes={userTypes}
            showHeader={false}
            showFooter={false}
          />
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterContent />
      </SidebarFooter>
    </Sidebar>
  );
}
