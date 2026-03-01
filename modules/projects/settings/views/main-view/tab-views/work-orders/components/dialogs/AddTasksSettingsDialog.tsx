"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogTitle,
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

export interface AddTasksSettingsDialogProps {
  open: boolean;
  setOpenModal: (open: boolean) => void;
}

export default function AddTasksSettingsDialog({
  open,
  setOpenModal,
}: AddTasksSettingsDialogProps) {
  const t = useTranslations("projectSettings.tasksSettings");
  const tForm = useTranslations("projectSettings.tasksSettings.form");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

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
          {t("addTasksSettings")}
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
          <FormControl fullWidth>
            <InputLabel>{tForm("workOrderType")}</InputLabel>
            <Select label={tForm("workOrderType")}>
              <MenuItem value="">
                {tForm("workOrderTypePlaceholder")}
              </MenuItem>
              <MenuItem value="type1">نوع أمر العمل 1</MenuItem>
              <MenuItem value="type2">نوع أمر العمل 2</MenuItem>
              <MenuItem value="type3">نوع أمر العمل 3</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>{tForm("tasks")}</InputLabel>
            <Select
              multiple
              value={selectedTasks}
              onChange={(e) => setSelectedTasks(e.target.value as string[])}
              label={tForm("tasks")}
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
