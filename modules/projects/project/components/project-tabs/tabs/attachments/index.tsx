"use client";

import { useProject } from "@/modules/all-project/context/ProjectContext";
import { PublicDocsCxtProvider } from "@/modules/docs-library/modules/publicDocs/contexts/public-docs-cxt";
import PublicDocsTabEntryPoint from "@/modules/docs-library/modules/publicDocs/views/public-docs-tab/entry-point";

export default function AttachmentsTab() {
  const { projectId } = useProject();

  return (
    <PublicDocsCxtProvider projectId={projectId}>
      <PublicDocsTabEntryPoint />
    </PublicDocsCxtProvider>
  );
}
