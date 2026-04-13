"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Breakpoint } from "@mui/material/styles";

export type InboxRequestDetailDialogProps = {
  open: boolean;
  onClose: () => void;
  /** Primary heading */
  title: ReactNode;
  /** Optional subtitle under the title */
  subtitle?: ReactNode;
  /** Wide column (e.g. details + actions) */
  main: ReactNode;
  /** Narrow column (e.g. timeline + comments) */
  sidebar: ReactNode;
  /** `aria-label` for the close control */
  closeAriaLabel: string;
  maxWidth?: Breakpoint | false;
  /** Main column grid size (MUI Grid v2 `size`) */
  mainGridSize?: { xs?: number; md?: number };
  /** Sidebar column grid size */
  sidebarGridSize?: { xs?: number; md?: number };
};

/**
 * Two-column request detail shell (title bar + scrollable content).
 * Domain-specific content goes in `main` and `sidebar`.
 */
export function InboxRequestDetailDialog({
  open,
  onClose,
  title,
  subtitle,
  main,
  sidebar,
  closeAriaLabel,
  maxWidth = "lg",
  mainGridSize = { xs: 12, md: 8.5 },
  sidebarGridSize = { xs: 12, md: 3.5 },
}: InboxRequestDetailDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      scroll="paper"
      slotProps={{
        paper: {
          sx: {
            bgcolor: "background.paper",
            backgroundImage: "none",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          pr: 1,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" component="span" fontWeight={700}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        <IconButton
          aria-label={closeAriaLabel}
          onClick={onClose}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        <Grid container spacing={3}>
          <Grid size={mainGridSize}>{main}</Grid>
          <Grid size={sidebarGridSize}>{sidebar}</Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
