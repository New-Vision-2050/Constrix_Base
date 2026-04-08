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

export default function ConfirmShareDialog({
  open,
  onClose,
  onConfirm,
  isSubmitting,
}: ConfirmShareDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box
        sx={{
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          aria-label="إلغاء"
          disabled={isSubmitting}
          sx={{ position: "absolute", top: 8, insetInlineEnd: 8 }}
        >
          <Close />
        </IconButton>
        <DialogTitle sx={{ textAlign: "center", pr: 5, pb: 1 }}>
          تأكيد المشاركة
        </DialogTitle>
      </Box>

      <DialogContent sx={{ py: 3, px: 3 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 , display: "flex", justifyContent: "center" }}>
          هل أنت متأكد من مشاركة هذا المشروع؟
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
            تأكيد
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={onClose}
            disabled={isSubmitting}
          >
            إلغاء
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
