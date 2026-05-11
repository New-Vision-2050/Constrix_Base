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
import { ProjectSharingWorkOrdersApi } from "@/services/api/projects/project-sharing-work-orders";
import { ProjectSharingTasksApi } from "@/services/api/projects/project-sharing-tasks";

const TASK_SETTING_DETAIL_KEY = "project-sharing-tasks-setting";
const WORK_ORDERS_QUERY_KEY = "project-sharing-work-orders";
const TASKS_QUERY_KEY = "project-sharing-tasks";

export type TasksSettingsDetailsDialogProps = DetailsDialogProps & {
  projectTypeId: number;
};

const TasksSettingsDetailsDialog = ({
  open,
  setOpenModal,
  rowId,
  projectTypeId,
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

  const { data: workOrders = [] } = useQuery({
    queryKey: [WORK_ORDERS_QUERY_KEY, projectTypeId],
    queryFn: async () => {
      const res = await ProjectSharingWorkOrdersApi.list(projectTypeId);
      return res.data.payload ?? [];
    },
    enabled:
      open &&
      Boolean(rowId) &&
      Number.isFinite(projectTypeId) &&
      projectTypeId > 0,
  });

  const { data: tasksList = [] } = useQuery({
    queryKey: [TASKS_QUERY_KEY, projectTypeId],
    queryFn: async () => {
      const res = await ProjectSharingTasksApi.list(projectTypeId);
      return res.data.payload ?? [];
    },
    enabled:
      open &&
      Boolean(rowId) &&
      Number.isFinite(projectTypeId) &&
      projectTypeId > 0,
  });

  const setting = detailQuery.data;

  const workOrderLabel = useMemo(() => {
    if (!setting) return "";
    const wo = workOrders.find(
      (w) => w.id === setting.project_sharing_work_order_id,
    );
    return wo ? `${wo.code} — ${wo.type}` : String(setting.project_sharing_work_order_id);
  }, [setting, workOrders]);

  const taskLabel = useMemo(() => {
    if (!setting) return "";
    const tk = tasksList.find((t) => t.id === setting.project_sharing_task_id);
    return tk
      ? `${tk.code} — ${tk.name}`
      : String(setting.project_sharing_task_id);
  }, [setting, tasksList]);

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
