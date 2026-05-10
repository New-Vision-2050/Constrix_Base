"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
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

export interface EditTasksDialogProps {
  open: boolean;
  onClose: () => void;
  taskId?: string;
  onSuccess?: () => void;
}

export default function EditTasksDialog({
  open,
  onClose,
  taskId,
  onSuccess,
}: EditTasksDialogProps) {
  const t = useTranslations("projectSettings.addTasks");
  const tForm = useTranslations("projectSettings.addTasks.form");

  const [code, setCode] = useState("");
  const [name, setName] = useState("");

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
    setCode(p.code ?? "");
    setName(p.name ?? "");
  }, [detailQuery.data]);

  useEffect(() => {
    if (!open) {
      setCode("");
      setName("");
    }
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  const updateMutation = useMutation({
    mutationFn: () =>
      ProjectSharingTasksApi.update(taskId!, {
        code: code.trim(),
        name: name.trim(),
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskId) return;
    if (!code.trim() || !name.trim()) {
      toast.error(tForm("validationError"));
      return;
    }
    updateMutation.mutate();
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
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              label={tForm("taskCode")}
              required
              fullWidth
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={tForm("taskCodePlaceholder")}
            />

            <TextField
              label={tForm("tasksName")}
              required
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
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
