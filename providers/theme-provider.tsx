"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function ThemeSyncer() {
  const { theme } = useTheme();

  React.useEffect(() => {
    if (theme) {
      document.cookie = `theme=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
    }
  }, [theme]);

  return null;
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ThemeSyncer />
      {children}
    </NextThemesProvider>
  );
}
