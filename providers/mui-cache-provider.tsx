"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { prefixer } from "stylis";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { useMemo } from "react";

export default function MuiCacheProvider({
  direction,
  children,
}: {
  direction: "rtl" | "ltr";
  children: React.ReactNode;
}) {
  const options = useMemo(
    () =>
      direction === "rtl"
        ? { key: "muirtl", stylisPlugins: [prefixer, rtlPlugin] }
        : { key: "mui" },
    [direction],
  );

  return (
    <AppRouterCacheProvider options={options}>
      {children}
    </AppRouterCacheProvider>
  );
}
