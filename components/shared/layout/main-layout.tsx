"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SparklesCore } from "@/modules/auth/components/sparkles-core";
import { AppSidebar } from "./app-sidebar";
import { useLocale } from "next-intl";
import Header from "./header";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useSidebarStore } from "@/store/useSidebarStore";

export default function MainLayout({
  children,
  isCentral,
  mainLogo,
  name,
}: Readonly<{
  children: React.ReactNode;
  isCentral: boolean;
  mainLogo?: string;
  name?: string;
}>) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const { theme } = useTheme();
  const isLight = theme === "light";

  // handle side effects - clear side-menu when page reload
  useEffect(() => {
    const navType = performance.getEntriesByType("navigation")?.[0]
      ?.type as string;

    if (navType === "reload") {
      useSidebarStore.getState().clearMenu();
    }
  }, []);

  return (
    <main className="relative" dir={isRtl ? "rtl" : "ltr"}>
      <SparklesCore
        id="tsparticlesfullpage"
        background={isLight ? "#ffffff" : "#18003A"}
        minSize={0.6}
        maxSize={1.4}
        particleDensity={100}
        className="h-full w-full absolute -z-20"
        particleColor={isLight ? "#18003A" : "#ffffff"}
      />{" "}
      <SidebarProvider>
        <AppSidebar name={name} mainLogo={mainLogo} isCentral={isCentral} />
        <SidebarInset className="bg-transparent md:max-w-[calc(100vw-(var(--sidebar-width)))] md:overflow-hidden">
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
