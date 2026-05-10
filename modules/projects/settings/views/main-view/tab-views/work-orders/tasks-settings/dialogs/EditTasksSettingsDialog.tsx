"use client";

import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  IconButton,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { RhfTextField } from "../../shared/rhf-mui";
import {
  createTasksSettingsEditFormSchema,
  type TasksSettingsEditFormValues,
} from "../../shared/form-schemas";

export interface EditTasksSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  taskSettingId?: string;
}

const emptyValues: TasksSettingsEditFormValues = {
  serialNumber: "",
  tasks: [],
};

const TASK_OPTIONS = [
  { value: "task1", label: "مهمة أولى" },
  { value: "task2", label: "مهمة ثانية" },
  { value: "task3", label: "مهمة ثالثة" },
  { value: "task4", label: "مهمة رابعة" },
];

export default function EditTasksSettingsDialog({
  open,
  onClose,
}: EditTasksSettingsDialogProps) {
  const t = useTranslations("projectSettings.tasksSettings");
  const tForm = useTranslations("projectSettings.tasksSettings.form");

  const schema = useMemo(
    () => createTasksSettingsEditFormSchema(tForm),
    [tForm],
  );

  const form = useForm<TasksSettingsEditFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (!open) {
      reset(emptyValues);
    }
  }, [open, reset]);

  const handleClose = () => {
    onClose();
  };

  const onSubmit = (_values: TasksSettingsEditFormValues) => {
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          color: "text.primary",
          borderRadius: "8px",
          border: 1,
          borderColor: "divider",
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
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <RhfTextField
            name="serialNumber"
            control={control}
            label={tForm("serialNumber")}
            required
            fullWidth
            placeholder={tForm("serialNumberPlaceholder")}
          />

          <Controller
            name="tasks"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error}>
                <InputLabel>{tForm("tasksName")}</InputLabel>
                <Select
                  multiple
                  label={tForm("tasksName")}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  renderValue={(selected) =>
                    Array.isArray(selected) ? selected.join(", ") : ""
                  }
                >
                  {TASK_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      <Checkbox
                        checked={(field.value ?? []).includes(opt.value)}
                      />
                      <ListItemText primary={opt.label} />
                    </MenuItem>
                  ))}
                </Select>
                {fieldState.error?.message ? (
                  <FormHelperText>{fieldState.error.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {tForm("save")}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
