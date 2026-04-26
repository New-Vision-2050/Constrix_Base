"use client";

import ConstrixIcon from "@/public/icons/constrix";
import NewVision from "@/public/icons/new-vision";
import NewVisionWhite from "@/public/icons/new-vision-white";
import { SparklesCore } from "./components/sparkles-core";
import { useTranslations } from "next-intl";
import Image from "next/image";
import LogoPlaceholder from "@/public/images/logo-placeholder-image.png";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function AuthLayout({
  children,
  mainLogo,
}: Readonly<{
  children: React.ReactNode;
  mainLogo?: string;
}>) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const t = useTranslations();

  const sparklesBg: Record<string, string> = {
    light: "#ffffff",
    dark: "#18003A",
    "green-light": "#ffffff",
    "green-dark": "#092A1E",
  };
  const sparklesParticle: Record<string, string> = {
    light: "#18003A",
    dark: "#ffffff",
    "green-light": "#111927",
    "green-dark": "#ffffff",
  };
  const currentTheme = mounted ? (resolvedTheme ?? "dark") : "dark";
  const bgColor = sparklesBg[currentTheme] ?? sparklesBg.dark;
  const particleColor = sparklesParticle[currentTheme] ?? sparklesParticle.dark;
  const isGreenTheme =
    currentTheme === "green-light" || currentTheme === "green-dark";
  const greenStyle = isGreenTheme
    ? {
        backgroundColor: "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
      }
    : undefined;

  return (
    <main className="min-h-screen   flex flex-col relative overflow-hidden ">
      {/* Language switcher */}
      {/* <div className="fixed top-4 end-4 z-50">
        <RenderLocaleSwitch />
      </div> */}

      {/* Background particles */}
      <SparklesCore
        id="tsparticlesfullpage"
        background={bgColor}
        minSize={0.6}
        maxSize={1.4}
        particleDensity={100}
        className="h-screen w-full fixed top-0 left-0 inset-0"
        particleColor={particleColor}
      />

      {/* Header with logos */}
      <header className="w-full bg-sidebar pt-8 pb-16 rounded-b-[50%] z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="order-3 md:order-1 mt-2 md:mt-0 scale-75 md:scale-100">
            <ConstrixIcon className=" animate-[sidebar-logo-breathe_4s_ease-in-out_infinite] will-change-transform" />
            <style jsx>{`
        @keyframes sidebar-logo-breathe {
          0%,
          100% {
            transform: scale(0.74);
          }
          50% {
            transform: scale(1);
          }
        }
      `}</style>
          </div>
          <h1 className="order-2 md:order-2 text-xl md:text-4xl text-center">
            {t("Login.Control_panel")}
          </h1>
          <div className="order-1 md:order-3 mb-2 md:mb-0 rounded-full overflow-hidden w-[70px] h-[70px]">
            {mainLogo ? (
              <Image
                src={mainLogo}
                alt="logo"
                width={70}
                height={70}
                priority
                className="w-[70px] h-[70px] rounded-full object-cover overflow-hidden"
              />
            ) : (
              <Image
                src={LogoPlaceholder}
                alt={"logo placeholder"}
                width={70}
                height={70}
                priority
                className="w-[80px] h-[80px] rounded-full object-cover overflow-hidden"
              />
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-grow flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-lg rounded-md px-3 sm:px-4 py-5 sm:py-7 bg-background border border-lines/20">
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer
        className="w-full bg-sidebar pb-8 pt-16 rounded-t-[50%] z-10"
        style={greenStyle}
      >
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-5 text-center sm:text-start">
          <p className="text-xs sm:text-sm">{t("Login.Copyright")}</p>
          <div className="scale-75 sm:scale-100">
            <NewVisionWhite />
          </div>
        </div>
      </footer>
    </main>
  );
}
