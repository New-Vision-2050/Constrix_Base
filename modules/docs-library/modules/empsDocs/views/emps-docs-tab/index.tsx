"use client";

import { PublicDocsCxtProvider } from "../../../publicDocs/contexts/public-docs-cxt";
import PublicDocsTabEntryPoint from "../../../publicDocs/views/public-docs-tab/entry-point";

export default function EmpsDocsTab() {
  return (
    <PublicDocsCxtProvider fixedType="employee">
      <PublicDocsTabEntryPoint />
    </PublicDocsCxtProvider>
  );
}
