"use client";

import { PublicDocsCxtProvider } from "../../contexts/public-docs-cxt";
import PublicDocsTabEntryPoint from "./entry-point";

export default function PublicDocsTab() {
  return (
    <PublicDocsCxtProvider>
      <PublicDocsTabEntryPoint />
    </PublicDocsCxtProvider>
  );
}
