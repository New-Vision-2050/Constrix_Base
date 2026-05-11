"use client";

import React, { useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { DetailsDialogProps } from "../../shared/types";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { ProjectSharingTaskSettingApi } from "@/services/api/projects/project-sharing-tasks-setting";

const TASK_SETTING_DETAIL_KEY = "project-sharing-tasks-setting";

export type TasksSettingsDetailsDialogProps = DetailsDialogProps & {
  projectTypeId: number;
};

const TasksSettingsDetailsDialog = ({
  open,
  setOpenModal,
  rowId,
}: TasksSettingsDetailsDialogProps) => {
  const tDetails = useTranslations("projectSettings.tasksSettings.details");
  const handleClose = () => setOpenModal(false);

  const detailQuery = useQuery({
    queryKey: [TASK_SETTING_DETAIL_KEY, rowId],
    queryFn: async () => {
      const res = await ProjectSharingTaskSettingApi.show(rowId!);
      return res.data.payload;
    },
    enabled: open && Boolean(rowId),
  });

  const setting = detailQuery.data;

  const workOrderLabel = useMemo(() => {
    if (!setting) return "";
    const wo = setting.order_permit;
    return wo ? `${wo.type}` : "—";
  }, [setting]);

  const taskLabel = useMemo(() => {
    if (!setting) return "";
    const tk = setting.order_permit_task;
    return tk ? `${tk.name}` : "—";
  }, [setting]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          p: 2,
        },
      }}
    >
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

      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.25rem",
          pb: 1,
        }}
      >
        {tDetails("title")}
      </DialogTitle>

      <DialogContent>
        {detailQuery.isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : detailQuery.isError || !setting ? (
          <Typography textAlign="center" color="error">
            {tDetails("notFound")}
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Typography variant="body2">
              <strong>{tDetails("workOrderType")}:</strong> {workOrderLabel}
            </Typography>
            <Typography variant="body2">
              <strong>{tDetails("task")}:</strong> {taskLabel}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{tDetails("createdAt")}:</strong> {setting.created_at}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{tDetails("updatedAt")}:</strong> {setting.updated_at}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TasksSettingsDetailsDialog;
