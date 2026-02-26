"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface AddActionsDialogProps {
  open: boolean;
  setOpenModal: (open: boolean) => void;
}

export default function AddActionsDialog({
  open,
  setOpenModal,
}: AddActionsDialogProps) {
  const t = useTranslations("projectSettings.actions");
  const tForm = useTranslations("projectSettings.actions.form");

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          position: "fixed",
          top: 0,
          right: 0,
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        <DialogTitle
          sx={{
            p: 0,
            mb: 3,
            textAlign: "center",
            fontSize: "1.125rem",
            fontWeight: 600,
          }}
        >
          {t("addAction")}
        </DialogTitle>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label={tForm("actionCode")}
            required
            fullWidth
            placeholder={tForm("actionCodePlaceholder")}
          />

          <TextField
            label={tForm("actionDescription")}
            required
            fullWidth
            placeholder={tForm("actionDescriptionPlaceholder")}
            multiline
            rows={3}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {tForm("save")}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
