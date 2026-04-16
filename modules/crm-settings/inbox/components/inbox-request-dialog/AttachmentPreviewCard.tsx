import { Box, IconButton, Paper, Typography, useTheme } from "@mui/material";
import { ReactNode } from "react";

import { Download, ExternalLink, FileText } from "lucide-react";
import { downloadAttachmentFile } from "@/modules/projects/project/components/project-tabs/tabs/document-cycle/attachmentActions";
import { fileNameFromLink } from "./InboxRequestMainSections";

/** Secondary line under the file name — mirrors `AttachmentCard` (`size` / `type`). */
function attachmentSubtitle(
    mimeType: string | null | undefined,
    fileName: string,
  ): string {
    const m = (mimeType ?? "").trim();
    if (m) return m;
    const lower = fileName.toLowerCase();
    const dot = lower.lastIndexOf(".");
    if (dot >= 0 && dot < lower.length - 1) {
      return lower.slice(dot + 1).toUpperCase();
    }
    return "—";
  }

export default function AttachmentPreviewCard({
    href,
    label,
    mimeType,
    fileName,
    onView,
    downloadLabel,
  }: {
    href: string;
    label: ReactNode;
    mimeType?: string | null;
    fileName?: string;
    onView?: () => void;
    downloadLabel?: string;
  }) {
    const theme = useTheme();
    const isRTL = theme.direction === "rtl";
    const nameStr = fileNameFromLink(label, fileName);
    const subtitle = attachmentSubtitle(mimeType, nameStr);
  
    const cardRowSx = {
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      px: 1.5,
      py: 1,
      minWidth: 0,
      flexDirection: isRTL ? "row" : "row-reverse",
      textDecoration: "none",
      color: "text.primary",
    } as const;
  
    const iconAndText = (
      <>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.5,
            bgcolor: "action.hover",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <FileText className="w-5 h-5" style={{ opacity: 0.7 }} aria-hidden />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, textAlign: "start" }}>
          <Typography
            variant="body2"
            fontWeight={600}
            color="text.primary"
            noWrap
            title={nameStr || undefined}
          >
            {label}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            noWrap
          >
            {subtitle}
          </Typography>
        </Box>
      </>
    );
  
    if (onView) {
      return (
        <Paper
          variant="outlined"
          role="button"
          tabIndex={0}
          onClick={onView}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onView();
            }
          }}
          sx={{ ...cardRowSx, cursor: "pointer" }}
        >
          {iconAndText}
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              alignItems: "center",
              flexShrink: 0,
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <IconButton
              size="small"
              aria-label={downloadLabel ?? "Download"}
              onClick={(e) => {
                e.stopPropagation();
                downloadAttachmentFile({ url: href, name: nameStr || "file" });
              }}
            >
              <Download className="w-4 h-4" />
            </IconButton>
          </Box>
        </Paper>
      );
    }
  
    return (
      <Paper
        variant="outlined"
        component="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={cardRowSx}
      >
        {iconAndText}
        <Box
          sx={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            color: "text.secondary",
          }}
        >
          <ExternalLink className="w-4 h-4" aria-hidden />
        </Box>
      </Paper>
    );
  }