"use client";

import NewVisionWhite from "@/public/icons/new-vision-white";
import { SparklesCore } from "@/modules/auth/components/sparkles-core";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Link } from "@i18n/navigation";
import { ROUTER } from "@/router";
import { ArrowLeft } from "lucide-react";

type PrivacyPolicyLayoutProps = {
  children: React.ReactNode;
  pageTitle: string;
};

export default function PrivacyPolicyLayout({
  children,
  pageTitle,
}: PrivacyPolicyLayoutProps) {
  const { resolvedTheme } = useTheme();
  const t = useTranslations();

  const sparklesParticle: Record<string, string> = {
    light: "#18003A",
    dark: "#ffffff",
    "green-light": "#111927",
    "green-dark": "#ffffff",
  };
  const particleColor = sparklesParticle[resolvedTheme ?? "dark"] ?? "#ffffff";

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      <SparklesCore
        id="tsparticles-privacy-policy"
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={80}
        className="h-screen w-full fixed top-0 left-0 inset-0 pointer-events-none"
        particleColor={particleColor}
      />

      <header className="w-full bg-sidebar pt-8 pb-14 sm:pt-10 sm:pb-16 rounded-b-[40%] sm:rounded-b-[50%] z-10">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-2xl md:text-4xl font-bold">{pageTitle}</h1>
          <div className="scale-[1.75] sm:scale-[2] mt-4">
            <NewVisionWhite />
          </div>
        </div>
      </header>

      <div className="flex-grow z-10 px-4 py-8 sm:py-10 md:py-12">
        <div className="container mx-auto max-w-5xl">{children}</div>
      </div>

      <footer className="w-full bg-sidebar auth-footer pb-8 pt-12 sm:pt-16 rounded-t-[40%] sm:rounded-t-[50%] z-10 mt-auto">
        <div className="container mx-auto px-4 flex flex-col items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTER.LOGIN}>
              <ArrowLeft aria-hidden />
              {t("Login.BackToLogin")}
            </Link>
          </Button>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-5 text-center sm:text-start">
            <p className="text-xs sm:text-sm">{t("Login.Copyright")}</p>
            <div className="scale-75 sm:scale-100">
              <NewVisionWhite />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
