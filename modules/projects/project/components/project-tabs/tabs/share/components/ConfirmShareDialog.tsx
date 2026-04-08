"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTranslations } from "next-intl";

export default function ConfirmShareDialog({
  open,
  onClose,
  onConfirm,
  isSubmitting,
}: ConfirmShareDialogProps) {
  const t = useTranslations("project.share");
  const tProject = useTranslations("project");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box
        sx={{
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          aria-label={tProject("cancel")}
          disabled={isSubmitting}
          sx={{ position: "absolute", top: 8, insetInlineEnd: 8 }}
        >
          <Close />
        </IconButton>
        <DialogTitle sx={{ textAlign: "center", pr: 5, pb: 1 }}>
          {t("confirmShareTitle")}
        </DialogTitle>
      </Box>

      <DialogContent sx={{ py: 3, px: 3 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 , display: "flex", justifyContent: "center" }}>
          {t("confirmShareMessage")}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={onConfirm}
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={18} color="inherit" />
              ) : undefined
            }
          >
            {t("confirmApprove")}
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {tProject("cancel")}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export interface ConfirmShareDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}
