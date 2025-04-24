"use client";
import { useEffect, useState } from "react";

export function usePrefersDarkMode(): boolean {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDarkMode(mediaQuery.matches);

      const handleChange = () => {
        setIsDarkMode(mediaQuery.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  return isDarkMode;
}
