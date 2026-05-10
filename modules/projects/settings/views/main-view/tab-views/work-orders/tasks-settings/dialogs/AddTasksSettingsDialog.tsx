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
import { RhfSelect } from "../../shared/rhf-mui";
import {
  createTasksSettingsFormSchema,
  type TasksSettingsFormValues,
} from "../../shared/form-schemas";

export interface AddTasksSettingsDialogProps {
  open: boolean;
  setOpenModal: (open: boolean) => void;
}

const defaultValues: TasksSettingsFormValues = {
  workOrderType: "",
  tasks: [],
};

const TASK_OPTIONS = [
  { value: "task1", label: "مهمة أولى" },
  { value: "task2", label: "مهمة ثانية" },
  { value: "task3", label: "مهمة ثالثة" },
  { value: "task4", label: "مهمة رابعة" },
];

export default function AddTasksSettingsDialog({
  open,
  setOpenModal,
}: AddTasksSettingsDialogProps) {
  const t = useTranslations("projectSettings.tasksSettings");
  const tForm = useTranslations("projectSettings.tasksSettings.form");

  const schema = useMemo(() => createTasksSettingsFormSchema(tForm), [tForm]);

  const form = useForm<TasksSettingsFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (!open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  const handleClose = () => {
    reset(defaultValues);
    setOpenModal(false);
  };

  const onSubmit = (_values: TasksSettingsFormValues) => {
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

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <RhfSelect
            name="workOrderType"
            control={control}
            label={tForm("workOrderType")}
          >
            <MenuItem value="">
              <em>{tForm("workOrderTypePlaceholder")}</em>
            </MenuItem>
            <MenuItem value="type1">نوع أمر العمل 1</MenuItem>
            <MenuItem value="type2">نوع أمر العمل 2</MenuItem>
            <MenuItem value="type3">نوع أمر العمل 3</MenuItem>
          </RhfSelect>

          <Controller
            name="tasks"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error}>
                <InputLabel>{tForm("tasks")}</InputLabel>
                <Select
                  multiple
                  label={tForm("tasks")}
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
