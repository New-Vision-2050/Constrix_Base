import type { ReactNode } from "react";

/** Matches MUI Chip color + timeline icon treatment. */
export type InboxApprovalTimelinePalette =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "default";

export type InboxApprovalTimelineEntry = {
  id: string;
  title: string;
  chipLabel: string;
  palette: InboxApprovalTimelinePalette;
  userLine: string;
};

export type InboxStatCardItem = {
  caption: ReactNode;
  value: ReactNode;
};
