"use client";

import React from "react";
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
import { ProjectSharingTasksApi } from "@/services/api/projects/project-sharing-tasks";

const TasksDetailsDialog = ({
  open,
  setOpenModal,
  rowId,
}: DetailsDialogProps) => {
  const tDetails = useTranslations("projectSettings.addTasks.details");

  const handleClose = () => setOpenModal(false);

  const detailQuery = useQuery({
    queryKey: ["project-sharing-tasks", rowId],
    queryFn: async () => {
      const res = await ProjectSharingTasksApi.show(rowId!);
      return res.data.payload;
    },
    enabled: open && Boolean(rowId),
  });

  const task = detailQuery.data;

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
        ) : detailQuery.isError || !task ? (
          <Typography textAlign="center" color="error">
            {tDetails("notFound")}
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Typography variant="body2">
              <strong>{tDetails("taskCode")}:</strong> {task.code}
            </Typography>
            <Typography variant="body2">
              <strong>{tDetails("taskName")}:</strong> {task.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{tDetails("createdAt")}:</strong> {task.created_at}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{tDetails("updatedAt")}:</strong> {task.updated_at}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TasksDetailsDialog;
