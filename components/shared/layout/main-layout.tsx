'use client';

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SparklesCore } from "@/modules/auth/components/sparkles-core";
import { AppSidebar } from "./app-sidebar";
import { useLocale } from "next-intl";
import Header from "./header";
import { useTheme } from "next-themes";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const { theme } = useTheme();
  const isLight = theme === "light" 

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
        <AppSidebar />
        <SidebarInset className="bg-transparent pb-5">
          <Header />
          {children}{" "}
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
