"use client";

import { Button } from "@/components/ui/button";
import LightIcon from "@/public/icons/light";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "next-intl";
import { useEffect, useCallback } from "react";

const GREEN_SYSTEM_KEY = "green-system-mode";

const ToggleTheme = () => {
  const { setTheme, theme } = useTheme();
  const locale = useLocale();
  const isRtl = locale === "ar";

  const resolveGreenSystem = useCallback(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setTheme(prefersDark ? "green-dark" : "green-light");
  }, [setTheme]);

  useEffect(() => {
    const isGreenSystem = localStorage.getItem(GREEN_SYSTEM_KEY) === "true";
    if (!isGreenSystem) return;

    resolveGreenSystem();

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => resolveGreenSystem();
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [resolveGreenSystem]);

  const handleTheme = (value: string) => {
    localStorage.setItem(GREEN_SYSTEM_KEY, "false");
    setTheme(value);
  };

  const handleGreenSystem = () => {
    localStorage.setItem(GREEN_SYSTEM_KEY, "true");
    resolveGreenSystem();
  };

  const isGreen =
    theme === "green-light" ||
    theme === "green-dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <LightIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRtl ? "start" : "end"}>
        <DropdownMenuLabel>Default</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleTheme("system")}>
          System
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: isGreen ? "#25935F" : "#88D8AD" }}
            />
            Green
          </span>
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleTheme("green-light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleTheme("green-dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleGreenSystem}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ToggleTheme;
