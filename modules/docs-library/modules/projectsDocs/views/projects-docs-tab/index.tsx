"use client";

import { PublicDocsCxtProvider } from "../../../publicDocs/contexts/public-docs-cxt";
import PublicDocsTabEntryPoint from "../../../publicDocs/views/public-docs-tab/entry-point";

export default function ProjectsDocsTab() {
  return (
    <PublicDocsCxtProvider isProject={true}>
      <PublicDocsTabEntryPoint />
    </PublicDocsCxtProvider>
  );
}
