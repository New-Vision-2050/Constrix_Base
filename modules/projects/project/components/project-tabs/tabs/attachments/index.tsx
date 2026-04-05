"use client";

import { ProjectAttachmentsCxtProvider } from "./context/project-attachments-cxt";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import ProjectAttachmentsEntryPoint from "./entry-point";

export default function AttachmentsTab() {
  const { projectId } = useProject();

  return (
    <ProjectAttachmentsCxtProvider projectId={projectId}>
      <ProjectAttachmentsEntryPoint />
    </ProjectAttachmentsCxtProvider>
  );
}
