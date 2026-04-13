"use client";

import type { ComponentType, ReactNode, SVGProps } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Archive,
  ExternalLink,
  File as FileIcon,
  FileText,
  Film,
  Image as ImageIcon,
} from "lucide-react";
import { inboxRequestDialogCardSx } from "./inbox-dialog-styles";
import type { InboxStatCardItem } from "./types";

function fileNameFromLink(
  label: ReactNode,
  fileName?: string,
): string {
  if (fileName?.trim()) return fileName.trim();
  if (typeof label === "string") return label;
  return "";
}

function attachmentVisual(
  mime: string | null | undefined,
  name: string,
): {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  badge: string;
  hue: "primary" | "secondary" | "success" | "warning" | "info" | "error";
} {
  const m = (mime ?? "").toLowerCase();
  const lower = name.toLowerCase();
  const dot = lower.lastIndexOf(".");
  const ext =
    dot >= 0 && dot < lower.length - 1
      ? lower.slice(dot + 1, dot + 8)
      : "";

  if (m.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg|bmp|ico)$/.test(lower)) {
    return { Icon: ImageIcon, badge: ext ? ext.toUpperCase() : "IMG", hue: "success" };
  }
  if (m.includes("pdf") || lower.endsWith(".pdf")) {
    return { Icon: FileText, badge: "PDF", hue: "error" };
  }
  if (
    m.startsWith("video/") ||
    /\.(mp4|webm|mov|mkv|avi)$/.test(lower)
  ) {
    return { Icon: Film, badge: ext ? ext.toUpperCase() : "VIDEO", hue: "info" };
  }
  if (
    m.includes("zip") ||
    m.includes("rar") ||
    m.includes("tar") ||
    m.includes("compressed") ||
    /\.(zip|rar|7z|tar|gz)$/.test(lower)
  ) {
    return { Icon: Archive, badge: ext ? ext.toUpperCase() : "ZIP", hue: "warning" };
  }
  if (
    m.includes("word") ||
    m.includes("document") ||
    /\.(doc|docx|odt)$/.test(lower)
  ) {
    return { Icon: FileText, badge: ext ? ext.toUpperCase() : "DOC", hue: "primary" };
  }
  if (
    m.includes("sheet") ||
    m.includes("excel") ||
    /\.(xls|xlsx|csv)$/.test(lower)
  ) {
    return { Icon: FileText, badge: ext ? ext.toUpperCase() : "SHEET", hue: "success" };
  }
  return {
    Icon: FileIcon,
    badge: ext ? ext.toUpperCase().slice(0, 6) : "FILE",
    hue: "secondary",
  };
}

function AttachmentPreviewCard({
  href,
  label,
  mimeType,
  fileName,
}: {
  href: string;
  label: ReactNode;
  mimeType?: string | null;
  fileName?: string;
}) {
  const nameStr = fileNameFromLink(label, fileName);
  const { Icon, badge, hue } = attachmentVisual(mimeType, nameStr);

  return (
    <Box
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1.5,
        minWidth: 0,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        bgcolor: "action.hover",
        textDecoration: "none",
        color: "text.primary",
        transition: (theme) =>
          theme.transitions.create(
            ["border-color", "box-shadow", "background-color", "transform"],
            { duration: theme.transitions.duration.shorter },
          ),
        "&:hover": {
          borderColor: (theme) => theme.palette[hue].main,
          bgcolor: (theme) =>
            alpha(theme.palette[hue].main, theme.palette.mode === "dark" ? 0.12 : 0.06),
          boxShadow: (theme) =>
            `0 0 0 1px ${alpha(theme.palette[hue].main, 0.35)}`,
          transform: "translateY(-1px)",
        },
        "&:focus-visible": {
          outline: 2,
          outlineOffset: 2,
          outlineColor: "primary.main",
        },
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 1.5,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette[hue].main, 0.28)} 0%, ${alpha(theme.palette[hue].main, 0.08)} 100%)`,
          border: 1,
          borderColor: (theme) => alpha(theme.palette[hue].main, 0.35),
          color: (theme) => theme.palette[hue].main,
        }}
      >
        <Icon className="w-6 h-6" strokeWidth={1.75} aria-hidden />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          fontWeight={700}
          noWrap
          title={nameStr || undefined}
          sx={{ lineHeight: 1.35 }}
        >
          {label}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 0.25, letterSpacing: 0.02 }}
        >
          {badge}
        </Typography>
      </Box>
      <Box
        sx={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          color: "primary.main",
          opacity: 0.85,
        }}
      >
        <ExternalLink className="w-5 h-5" aria-hidden />
      </Box>
    </Box>
  );
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
};

export function InboxRequestAttachmentsSection({
  title,
  emptyLabel,
  links,
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
