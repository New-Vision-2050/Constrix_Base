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

export default function MainLayout({
  children,
  mainLogo,
  name,
  userTypes,
}: Readonly<{
  children: React.ReactNode;
  isCentral: boolean;
  mainLogo?: string;
  name?: string;
  userTypes: UserRoleType[];
}>) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isLight = currentTheme === "light";

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
        background={isLight ? "#ffffff" : "#18003A"}
        minSize={0.6}
        maxSize={1.4}
        particleDensity={100}
        className="h-screen w-full fixed top-0 left-0 -z-20"
        particleColor={isLight ? "#18003A" : "#ffffff"}
      />{" "}
      <MobileDrawer
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerClose}
        userTypes={userTypes}
        name={name}
        mainLogo={mainLogo}
      />
      <SidebarProvider>
        <AppSidebar userTypes={userTypes} name={name} mainLogo={mainLogo} />
        <SidebarInset className="bg-transparent md:overflow-hidden border-none">
          <Header onMobileMenuClick={handleMobileDrawerToggle} />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
