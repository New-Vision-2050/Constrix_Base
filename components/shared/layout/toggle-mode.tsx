"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const ToggleMode = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Determine the effective theme (resolving "system" to actual theme)
  const effectiveTheme = theme === "system" ? systemTheme : theme;
  const isDark = effectiveTheme === "dark" || effectiveTheme === "green-dark";

  const handleToggle = () => {
    // Check if current theme is green variant
    const isGreen = theme === "green-light" || theme === "green-dark";
    
    if (isDark) {
      setTheme(isGreen ? "green-light" : "light");
    } else {
      setTheme(isGreen ? "green-dark" : "dark");
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="relative flex items-center justify-between px-2 w-[60px] h-8 rounded-full bg-slate-700/90 backdrop-blur-sm border border-slate-600/40 shadow-inner cursor-pointer overflow-visible"
      aria-label="Toggle dark mode"
    >
      {/* Sun icon - Left side (for light mode) */}
      <Sun
        className={cn(
          "h-3.5 w-3.5 transition-all duration-700 ease-out z-20",
          !isDark 
            ? "text-yellow-400 opacity-100" 
            : "text-slate-500 opacity-60"
        )}
        strokeWidth={2}
      />

      {/* Moon icon - Right side (for dark mode) */}
      <Moon
        className={cn(
          "h-3.5 w-3.5 transition-all duration-700 ease-out z-20",
          isDark 
            ? "text-blue-400 opacity-100" 
            : "text-slate-500 opacity-60"
        )}
        strokeWidth={2}
      />

      {/* Toggle circle - slides smoothly */}
      <span
        className={cn(
          "absolute h-7 w-7 rounded-full bg-gradient-to-br from-white to-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition-all duration-700 ease-out z-10",
          isDark 
            ? "left-[2px]" 
            : "left-[calc(100%-30px)]"
        )}
      />
    </button>
  );
};

export default ToggleMode;
