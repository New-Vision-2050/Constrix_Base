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

export interface AddTasksDialogProps {
  open: boolean;
  setOpenModal: (open: boolean) => void;
}

export default function AddTasksDialog({
  open,
  setOpenModal,
}: AddTasksDialogProps) {
  const t = useTranslations("projectSettings.addTasks");
  const tForm = useTranslations("projectSettings.addTasks.form");

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
          {t("addTask")}
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
            label={tForm("serialNumber")}
            required
            fullWidth
            placeholder={tForm("serialNumberPlaceholder")}
          />

          <TextField
            label={tForm("tasksName")}
            required
            fullWidth
            placeholder={tForm("tasksNamePlaceholder")}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {tForm("save")}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
