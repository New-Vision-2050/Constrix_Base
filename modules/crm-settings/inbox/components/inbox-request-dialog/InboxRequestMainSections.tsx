"use client";

import type { ReactNode } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { inboxRequestDialogCardSx } from "./inbox-dialog-styles";
import type { InboxStatCardItem } from "./types";
import AttachmentPreviewCard from "./AttachmentPreviewCard";

export function inboxAttachmentFileName(
  label: ReactNode,
  fileName?: string,
): string {
  return fileNameFromLink(label, fileName);
}

export function fileNameFromLink(
  label: ReactNode,
  fileName?: string,
): string {
  if (fileName?.trim()) return fileName.trim();
  if (typeof label === "string") return label;
  return "";
}

export type InboxRequestThreeStatCardsProps = {
  cards: readonly [InboxStatCardItem, InboxStatCardItem, InboxStatCardItem];
};

export function InboxRequestThreeStatCards({ cards }: InboxRequestThreeStatCardsProps) {
  return (
    <Grid container spacing={1.5}>
      {cards.map((card, i) => (
        <Grid key={i} size={{ xs: 12, sm: 4 }}>
          <Paper variant="outlined" sx={inboxRequestDialogCardSx}>
            <Typography variant="caption" color="text.primary" display="block">
              {card.caption}
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {card.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export type InboxRequestDescriptionSectionProps = {
  title: ReactNode;
  body: ReactNode;
};

export function InboxRequestDescriptionSection({
  title,
  body,
}: InboxRequestDescriptionSectionProps) {
  return (
    <Box>
      <Paper
        variant="outlined"
        sx={{ ...inboxRequestDialogCardSx, p: 2 }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
          {body}
        </Typography>
      </Paper>
    </Box>
  );
}

export type InboxRequestAttachmentLink = {
  id: string | number;
  href: string;
  label: ReactNode;
  /** For icon + type chip (e.g. from API `mime_type`). */
  mimeType?: string | null;
  /** Plain file name when `label` is not a string (used for extension detection). */
  fileName?: string;
};

export type InboxRequestAttachmentsSectionProps = {
  title: ReactNode;
  emptyLabel: ReactNode;
  links?: InboxRequestAttachmentLink[];
  /** Opens the same in-app viewer as project document cycle (`FileViewerDialog`). */
  onViewAttachment?: (link: InboxRequestAttachmentLink) => void;
  /** Shown on the download control when using `onViewAttachment`. */
  downloadLabel?: string;
};

export function InboxRequestAttachmentsSection({
  title,
  emptyLabel,
  links,
  onViewAttachment,
  downloadLabel,
}: InboxRequestAttachmentsSectionProps) {
  const hasLinks = links && links.length > 0;
  return hasLinks ? (
    <Box>
      <Paper variant="outlined" sx={{ ...inboxRequestDialogCardSx, p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
          {title}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
            },
            gap: 1.5,
          }}
        >
          {links!.map((a) => (
            <AttachmentPreviewCard
              key={String(a.id)}
              href={a.href}
              label={a.label}
              mimeType={a.mimeType}
              fileName={a.fileName}
              onView={
                onViewAttachment ? () => onViewAttachment(a) : undefined
              }
              downloadLabel={downloadLabel}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  ) : (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {emptyLabel}
      </Typography>
    </Box>
  );
}

export type InboxRequestActionButton = {
  key: string;
  label: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "error" | "inherit" | "success" | "info" | "warning";
};

export type InboxRequestActionRowProps = {
  actions: InboxRequestActionButton[];
};

export function InboxRequestActionRow({ actions }: InboxRequestActionRowProps) {
  if (actions.length === 0) return null;
  return (
    <Stack
      direction="row"
      spacing={1}
      flexWrap="wrap"
      justifyContent="flex-start"
      sx={{ pt: 1, gap: 1 }}
    >
      {actions.map((a) => (
        <Button
          key={a.key}
          variant={a.variant ?? "contained"}
          color={a.color ?? "primary"}
          onClick={a.onClick}
          disabled={a.disabled}
        >
          {a.label}
        </Button>
      ))}
    </Stack>
  );
}
