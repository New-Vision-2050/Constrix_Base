"use client";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { PropsWithChildren } from "react";

// Create rtl cache
const rtlCache = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function RTLProvider(
  props: PropsWithChildren<{
    direction: "ltr" | "rtl";
  }>
) {
  return props.direction === "rtl" ? (
    <CacheProvider value={rtlCache}>{props.children}</CacheProvider>
  ) : (
    props.children
  );
}
