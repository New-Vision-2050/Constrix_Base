"use client";

import ConstrixIcon from "@/public/icons/constrix";
import NewVisionWhite from "@/public/icons/new-vision-white";
import { SparklesCore } from "@/modules/auth/components/sparkles-core";
import { useTranslations } from "next-intl";
import Image from "next/image";
import LogoPlaceholder from "@/public/images/logo-placeholder-image.png";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Link } from "@i18n/navigation";
import { ROUTER } from "@/router";
import { ArrowLeft } from "lucide-react";

type PublicLegalLayoutProps = {
  children: React.ReactNode;
  mainLogo?: string;
  companyName?: string;
  pageTitle: string;
};

export default function PublicLegalLayout({
  children,
  mainLogo,
  companyName,
  pageTitle,
}: PublicLegalLayoutProps) {
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
        id="tsparticles-legal-page"
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={80}
        className="h-screen w-full fixed top-0 left-0 inset-0 pointer-events-none"
        particleColor={particleColor}
      />

      <header className="w-full bg-sidebar pt-6 pb-12 sm:pt-8 sm:pb-16 rounded-b-[40%] sm:rounded-b-[50%] z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="order-3 md:order-1 mt-2 md:mt-0 scale-75 md:scale-100">
            <ConstrixIcon className="animate-[sidebar-logo-breathe_4s_ease-in-out_infinite] will-change-transform" />
            <style jsx>{`
              @keyframes sidebar-logo-breathe {
                0%,
                100% {
                  transform: scale(0.54);
                }
                50% {
                  transform: scale(1);
                }
              }
            `}</style>
          </div>
          <div className="order-2 md:order-2 text-center">
            <h1 className="text-xl md:text-3xl font-bold">{pageTitle}</h1>
            {companyName ? (
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                {companyName}
              </p>
            ) : null}
          </div>
          <div className="order-1 md:order-3 mb-2 md:mb-0 rounded-full overflow-hidden w-[70px] h-[70px] shrink-0">
            {mainLogo ? (
              <Image
                src={mainLogo}
                alt="logo"
                width={70}
                height={70}
                priority
                className="w-[70px] h-[70px] rounded-full object-cover"
              />
            ) : (
              <Image
                src={LogoPlaceholder}
                alt="logo placeholder"
                width={70}
                height={70}
                priority
                className="w-[70px] h-[70px] rounded-full object-cover"
              />
            )}
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
