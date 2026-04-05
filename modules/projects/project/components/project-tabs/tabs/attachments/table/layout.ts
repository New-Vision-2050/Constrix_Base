import HeadlessTableLayout from "@/components/headless/table";
import type { ProjectAttachmentRow } from "./types";

/** URL-synced table params (`pa-*` query keys). */
export const ProjectAttachmentsTableLayout =
  HeadlessTableLayout<ProjectAttachmentRow>("pa");
