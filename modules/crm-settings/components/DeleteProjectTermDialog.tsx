"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useLocale } from "next-intl";

interface DeleteProjectTermDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export function DeleteProjectTermDialog({ open, onClose, onConfirm, itemName }: DeleteProjectTermDialogProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth dir={isRtl ? "rtl" : "ltr"}>
      <DialogTitle>تأكيد الحذف</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography>
            هل أنت متأكد من حذف البند "{itemName}"؟
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            هذا الإجراء لا يمكن التراجع عنه.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button onClick={onClose}>إلغاء</Button>
          <Button onClick={onConfirm} variant="contained" >
            حذف
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
