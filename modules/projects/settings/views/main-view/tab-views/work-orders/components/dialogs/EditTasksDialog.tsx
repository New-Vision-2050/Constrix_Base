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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface EditTasksDialogProps {
  open: boolean;
  onClose: () => void;
  taskId?: string;
}

export default function EditTasksDialog({
  open,
  onClose,
}: EditTasksDialogProps) {
  const t = useTranslations("projectSettings.addTasks");
  const tForm = useTranslations("projectSettings.addTasks.form");

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          color: "white",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
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
          {t("editTask")}
        </DialogTitle>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            label={tForm("serialNumber")}
            required
            fullWidth
            placeholder={tForm("serialNumberPlaceholder")}
          />

          <FormControl fullWidth>
            <InputLabel>{tForm("tasksName")}</InputLabel>
            <Select label={tForm("tasksName")}>
              <MenuItem value="">
                {tForm("tasksNameSelectPlaceholder")}
              </MenuItem>
              <MenuItem value="task1">مهمة أولى</MenuItem>
              <MenuItem value="task2">مهمة ثانية</MenuItem>
              <MenuItem value="task3">مهمة ثالثة</MenuItem>
              <MenuItem value="task4">مهمة رابعة</MenuItem>
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {tForm("save")}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
