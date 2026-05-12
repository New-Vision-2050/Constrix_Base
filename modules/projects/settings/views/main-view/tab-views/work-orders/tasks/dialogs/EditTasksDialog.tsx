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
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProjectSharingTasksApi } from "@/services/api/projects/project-sharing-tasks";
import { RhfTextField } from "../../shared/rhf-mui";
import {
  createTaskFormSchema,
  type TaskFormValues,
} from "../../shared/form-schemas";

export interface EditTasksDialogProps {
  open: boolean;
  onClose: () => void;
  taskId?: string;
  onSuccess?: () => void;
}

const emptyValues: TaskFormValues = {
  code: "",
  name: "",
};

export default function EditTasksDialog({
  open,
  onClose,
  taskId,
  onSuccess,
}: EditTasksDialogProps) {
  const t = useTranslations("projectSettings.addTasks");
  const tForm = useTranslations("projectSettings.addTasks.form");

  const schema = useMemo(() => createTaskFormSchema(tForm), [tForm]);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  const { control, handleSubmit, reset } = form;

  const detailQuery = useQuery({
    queryKey: ["project-sharing-tasks", taskId],
    queryFn: async () => {
      const res = await ProjectSharingTasksApi.show(taskId!);
      return res.data.payload;
    },
    enabled: open && Boolean(taskId),
  });

  useEffect(() => {
    const p = detailQuery.data;
    if (!p) return;
    reset({
      code: p.code ?? "",
      name: p.name ?? "",
    });
  }, [detailQuery.data, reset]);

  useEffect(() => {
    if (!open) {
      reset(emptyValues);
    }
  }, [open, reset]);

  const handleClose = () => {
    onClose();
  };

  const updateMutation = useMutation({
    mutationFn: (values: TaskFormValues) =>
      ProjectSharingTasksApi.update(taskId!, {
        code: values.code,
        name: values.name,
      }),
    onSuccess: () => {
      toast.success(tForm("updateSuccess"));
      onSuccess?.();
      handleClose();
    },
    onError: () => {
      toast.error(tForm("updateError"));
    },
  });

  const onSubmit = (values: TaskFormValues) => {
    if (!taskId) return;
    updateMutation.mutate(values);
  };

  const loading = detailQuery.isLoading && open && Boolean(taskId);

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
          {t("editTask")}
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

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : detailQuery.isError ? (
          <Typography color="error" textAlign="center">
            {tForm("updateError")}
          </Typography>
        ) : (
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
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                tForm("save")
              )}
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
