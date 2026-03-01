"use client";

import React, { useState } from "react";
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
  ListItemText,
  Checkbox,
} from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface EditTasksSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  taskSettingId?: string;
}

export default function EditTasksSettingsDialog({
  open,
  onClose,
}: EditTasksSettingsDialogProps) {
  const t = useTranslations("projectSettings.tasksSettings");
  const tForm = useTranslations("projectSettings.tasksSettings.form");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

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
          {t("editTasksSettings")}
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
            <Select
              multiple
              value={selectedTasks}
              onChange={(e) => setSelectedTasks(e.target.value as string[])}
              label={tForm("tasksName")}
              renderValue={(selected) =>
                Array.isArray(selected) ? selected.join(", ") : ""
              }
            >
              <MenuItem value="task1">
                <Checkbox checked={selectedTasks.includes("task1")} />
                <ListItemText primary="مهمة أولى" />
              </MenuItem>
              <MenuItem value="task2">
                <Checkbox checked={selectedTasks.includes("task2")} />
                <ListItemText primary="مهمة ثانية" />
              </MenuItem>
              <MenuItem value="task3">
                <Checkbox checked={selectedTasks.includes("task3")} />
                <ListItemText primary="مهمة ثالثة" />
              </MenuItem>
              <MenuItem value="task4">
                <Checkbox checked={selectedTasks.includes("task4")} />
                <ListItemText primary="مهمة رابعة" />
              </MenuItem>
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
