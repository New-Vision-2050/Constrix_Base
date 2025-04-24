"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SparklesCore } from "@/modules/auth/components/sparkles-core";
import { AppSidebar } from "./app-sidebar";
import { useLocale } from "next-intl";
import Header from "./header";
import { useTheme } from "next-themes";
import { usePrefersDarkMode } from "@/hooks/use-prefersDarkMode";

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
  const isDarkMode = usePrefersDarkMode();
  const { theme } = useTheme();

  // Determine background color based on theme and dark mode
  const backgroundColor =
    theme === "light"
      ? "#ffffff"
      : theme === "dark"
      ? "#18003A"
      : isDarkMode
      ? "#18003A"
      : "#ffffff";

  return (
    <main className="relative" dir={isRtl ? "rtl" : "ltr"}>
      <SparklesCore
        id="tsparticlesfullpage"
        background={backgroundColor}
        minSize={0.6}
        maxSize={1.4}
        particleDensity={100}
        className="h-full w-full absolute -z-20"
        particleColor={backgroundColor}
      />
      <SidebarProvider>
        <AppSidebar name={name} mainLogo={mainLogo} isCentral={isCentral} />
        <SidebarInset className="bg-transparent">
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
