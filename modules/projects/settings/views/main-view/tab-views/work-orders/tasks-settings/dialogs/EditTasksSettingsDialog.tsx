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
  MenuItem,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProjectSharingWorkOrdersApi } from "@/services/api/projects/project-sharing-work-orders";
import { ProjectSharingTasksApi } from "@/services/api/projects/project-sharing-tasks";
import { ProjectSharingTaskSettingApi } from "@/services/api/projects/project-sharing-tasks-setting";
import { RhfSelect } from "../../shared/rhf-mui";
import {
  createTaskSettingLinkFormSchema,
  type TaskSettingLinkFormValues,
} from "../../shared/form-schemas";

const TASK_SETTING_DETAIL_KEY = "project-sharing-tasks-setting";
const WORK_ORDERS_QUERY_KEY = "project-sharing-work-orders";
const TASKS_QUERY_KEY = "project-sharing-tasks";

export interface EditTasksSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  taskSettingId?: string;
  projectTypeId: number;
  onSuccess?: () => void;
}

const emptyValues: TaskSettingLinkFormValues = {
  projectSharingWorkOrderId: "",
  projectSharingTaskId: "",
};

export default function EditTasksSettingsDialog({
  open,
  onClose,
  taskSettingId,
  projectTypeId,
  onSuccess,
}: EditTasksSettingsDialogProps) {
  const t = useTranslations("projectSettings.tasksSettings");
  const tForm = useTranslations("projectSettings.tasksSettings.form");

  const schema = useMemo(() => createTaskSettingLinkFormSchema(tForm), [tForm]);

  const form = useForm<TaskSettingLinkFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  const { control, handleSubmit, reset } = form;

  const detailQuery = useQuery({
    queryKey: [TASK_SETTING_DETAIL_KEY, taskSettingId],
    queryFn: async () => {
      const res = await ProjectSharingTaskSettingApi.show(taskSettingId!);
      return res.data.payload;
    },
    enabled: open && Boolean(taskSettingId),
  });

  const { data: workOrders = [], isLoading: workOrdersLoading } = useQuery({
    queryKey: [WORK_ORDERS_QUERY_KEY, projectTypeId],
    queryFn: async () => {
      const res = await ProjectSharingWorkOrdersApi.list(projectTypeId);
      return res.data.payload ?? [];
    },
    enabled:
      open &&
      Boolean(taskSettingId) &&
      Number.isFinite(projectTypeId) &&
      projectTypeId > 0,
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: [TASKS_QUERY_KEY, projectTypeId],
    queryFn: async () => {
      const res = await ProjectSharingTasksApi.list(projectTypeId);
      return res.data.payload ?? [];
    },
    enabled:
      open &&
      Boolean(taskSettingId) &&
      Number.isFinite(projectTypeId) &&
      projectTypeId > 0,
  });

  useEffect(() => {
    const p = detailQuery.data;
    if (!p) return;
    reset({
      projectSharingWorkOrderId: String(p.order_permit?.id ?? ""),
      projectSharingTaskId: String(p.order_permit_task?.id ?? ""),
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
    mutationFn: (values: TaskSettingLinkFormValues) =>
      ProjectSharingTaskSettingApi.update(taskSettingId!, {
        order_permit_id: Number(values.projectSharingWorkOrderId),
        order_permit_task_id: Number(values.projectSharingTaskId),
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

  const onSubmit = (values: TaskSettingLinkFormValues) => {
    if (!taskSettingId) return;
    updateMutation.mutate(values);
  };

  const listsLoading = workOrdersLoading || tasksLoading;
  const loading =
    (detailQuery.isLoading && open && Boolean(taskSettingId)) || listsLoading;

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
            <RhfSelect
              name="projectSharingWorkOrderId"
              control={control}
              label={tForm("workOrderType")}
            >
              <MenuItem value="">
                <em>{tForm("workOrderTypePlaceholder")}</em>
              </MenuItem>
              {workOrders.map((wo) => (
                <MenuItem key={wo.id} value={String(wo.id)}>
                  {wo.code} — {wo.type}
                </MenuItem>
              ))}
            </RhfSelect>

            <RhfSelect
              name="projectSharingTaskId"
              control={control}
              label={tForm("tasks")}
            >
              <MenuItem value="">
                <em>{tForm("tasksPlaceholder")}</em>
              </MenuItem>
              {tasks.map((task) => (
                <MenuItem key={task.id} value={String(task.id)}>
                  {task.code} — {task.name}
                </MenuItem>
              ))}
            </RhfSelect>

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
