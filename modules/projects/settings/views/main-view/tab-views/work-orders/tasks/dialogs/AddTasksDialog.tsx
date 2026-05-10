"use client";

import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProjectSharingTasksApi } from "@/services/api/projects/project-sharing-tasks";
import { RhfTextField } from "../../shared/rhf-mui";
import {
  createTaskFormSchema,
  type TaskFormValues,
} from "../../shared/form-schemas";

export interface AddTasksDialogProps {
  open: boolean;
  setOpenModal: (open: boolean) => void;
  projectTypeId: number;
  onSuccess?: () => void;
}

const defaultValues: TaskFormValues = {
  code: "",
  name: "",
};

export default function AddTasksDialog({
  open,
  setOpenModal,
  projectTypeId,
  onSuccess,
}: AddTasksDialogProps) {
  const t = useTranslations("projectSettings.addTasks");
  const tForm = useTranslations("projectSettings.addTasks.form");

  const schema = useMemo(() => createTaskFormSchema(tForm), [tForm]);

  const form = useForm<TaskFormValues>({
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

  const createMutation = useMutation({
    mutationFn: (values: TaskFormValues) =>
      ProjectSharingTasksApi.create({
        project_type_id: projectTypeId,
        code: values.code,
        name: values.name,
      }),
    onSuccess: () => {
      toast.success(tForm("createSuccess"));
      onSuccess?.();
      handleClose();
    },
    onError: () => {
      toast.error(tForm("createError"));
    },
  });

  const onSubmit = (values: TaskFormValues) => {
    createMutation.mutate(values);
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

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <RhfTextField
            name="code"
            control={control}
            label={tForm("taskCode")}
            fullWidth
            placeholder={tForm("taskCodePlaceholder")}
          />

          <RhfTextField
            name="name"
            control={control}
            label={tForm("tasksName")}
            fullWidth
            placeholder={tForm("tasksNamePlaceholder")}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={createMutation.isPending || !projectTypeId}
          >
            {createMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              tForm("save")
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
