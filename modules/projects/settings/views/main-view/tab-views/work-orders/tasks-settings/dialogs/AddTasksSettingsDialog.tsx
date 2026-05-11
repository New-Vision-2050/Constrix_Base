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

const WORK_ORDERS_QUERY_KEY = "project-sharing-work-orders";
const TASKS_QUERY_KEY = "project-sharing-tasks";

export interface AddTasksSettingsDialogProps {
  open: boolean;
  setOpenModal: (open: boolean) => void;
  projectTypeId: number;
  onSuccess?: () => void;
}

const defaultValues: TaskSettingLinkFormValues = {
  projectSharingWorkOrderId: "",
  projectSharingTaskId: "",
};

export default function AddTasksSettingsDialog({
  open,
  setOpenModal,
  projectTypeId,
  onSuccess,
}: AddTasksSettingsDialogProps) {
  const t = useTranslations("projectSettings.tasksSettings");
  const tForm = useTranslations("projectSettings.tasksSettings.form");

  const schema = useMemo(
    () => createTaskSettingLinkFormSchema(tForm),
    [tForm],
  );

  const form = useForm<TaskSettingLinkFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { control, handleSubmit, reset } = form;

  const { data: workOrders = [], isLoading: workOrdersLoading } = useQuery({
    queryKey: [WORK_ORDERS_QUERY_KEY, projectTypeId],
    queryFn: async () => {
      const res = await ProjectSharingWorkOrdersApi.list(projectTypeId);
      return res.data.payload ?? [];
    },
    enabled: open && Number.isFinite(projectTypeId) && projectTypeId > 0,
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: [TASKS_QUERY_KEY, projectTypeId],
    queryFn: async () => {
      const res = await ProjectSharingTasksApi.list(projectTypeId);
      return res.data.payload ?? [];
    },
    enabled: open && Number.isFinite(projectTypeId) && projectTypeId > 0,
  });

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
    mutationFn: (values: TaskSettingLinkFormValues) =>
      ProjectSharingTaskSettingApi.create({
        project_type_id: projectTypeId,
        project_sharing_work_order_id: Number(values.projectSharingWorkOrderId),
        project_sharing_task_id: Number(values.projectSharingTaskId),
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

  const onSubmit = (values: TaskSettingLinkFormValues) => {
    createMutation.mutate(values);
  };

  const listsLoading = workOrdersLoading || tasksLoading;

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

        {listsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
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
              disabled={createMutation.isPending || !projectTypeId}
            >
              {createMutation.isPending ? (
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
