"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function useGetTheme(): string | null {
  const { resolvedTheme } = useTheme();
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    if (resolvedTheme) {
      setTheme(resolvedTheme);
    }
  }, [resolvedTheme]);

  return theme;
}
