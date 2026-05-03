"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SparklesCore } from "@/modules/auth/components/sparkles-core";
import { AppSidebar } from "./app-sidebar";
import { useLocale } from "next-intl";
import Header from "./header";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useSidebarStore } from "@/store/useSidebarStore";
import { UserRoleType } from "@/app/[locale]/(main)/client-profile/[id]/types";
import { MobileDrawer } from "./mobile-drawer";
import AppFooter from "./app-footer";

export default function MainLayout({
  children,
  mainLogo,
  name,
  serialNumber,
  userTypes,
}: Readonly<{
  children: React.ReactNode;
  isCentral: boolean;
  mainLogo?: string;
  name?: string;
  serialNumber?: string;
  userTypes: UserRoleType[];
}>) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isLight = currentTheme === "light" || currentTheme === "green-light";
  const isGreen =
    currentTheme === "green-light" || currentTheme === "green-dark";

  // handle side effects - clear side-menu when page reload
  useEffect(() => {
    if (typeof window !== "undefined" && "performance" in window) {
      const entry = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      const navType = entry?.type;

      if (navType === "reload") {
        useSidebarStore.getState().clearMenu();
      }
    }
  }, []);

  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen((prev) => !prev);
  };

  const handleMobileDrawerClose = () => {
    setMobileDrawerOpen(false);
  };

  return (
    <main className="relative" dir={isRtl ? "rtl" : "ltr"}>
      <SparklesCore
        id="tsparticlesfullpage"
        background={
          isGreen
            ? isLight
              ? "#dcddde2f"
              : "#092A1E"
            : isLight
              ? "#ffffff"
              : "#18003A"
        }
        minSize={0.6}
        maxSize={1.4}
        particleDensity={100}
        className="h-screen w-full fixed top-0 left-0 -z-20 transition-all duration-500 ease-linear"
        particleColor={
          isGreen
            ? isLight
              ? "#25935F"
              : "#88D8AD"
            : isLight
              ? "#18003A"
              : "#ffffff"
        }
      />{" "}
      <MobileDrawer
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerClose}
        userTypes={userTypes}
        name={name}
        serialNumber={serialNumber}
        mainLogo={mainLogo}
      />
      <SidebarProvider>
        <AppSidebar
          userTypes={userTypes}
          name={name}
          serialNumber={serialNumber}
          mainLogo={mainLogo}
        />
        <SidebarInset className="bg-transparent md:overflow-hidden border-none min-h-svh relative flex flex-col justify-between">
          <div>
            <Header onMobileMenuClick={handleMobileDrawerToggle} />
            <div className="px-4 w-full">{children}</div>
          </div>
          <AppFooter />
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
