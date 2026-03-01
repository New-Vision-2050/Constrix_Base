import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DetailsDialogProps } from "../../types";
import { useTranslations } from "next-intl";

const mockTasks = [
  { id: "task1", tasksNumber: 1, tasksName: "مهمة أولى" },
  { id: "task2", tasksNumber: 2, tasksName: "مهمة ثانية" },
  { id: "task3", tasksNumber: 3, tasksName: "مهمة ثالثة" },
  { id: "task4", tasksNumber: 4, tasksName: "مهمة رابعة" },
];

const TasksDetailsDialog = ({
  open,
  setOpenModal,
  rowId,
}: DetailsDialogProps) => {
  const tDetails = useTranslations("projectSettings.addTasks.details");
  const handleClose = () => setOpenModal(false);

  const task = mockTasks.find((item) => item.id === rowId);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: "8px",
          p: 8,
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
          fontSize: "1.5rem",
          mb: 2,
        }}
      >
        {tDetails("title")}
      </DialogTitle>

      <DialogContent>
        {task && (
          <Box className="flex flex-col gap-4">
            <Typography variant="body1">
              <strong>{tDetails("serialNumber")}:</strong> {task.tasksNumber}
            </Typography>
            <Typography variant="body1">
              <strong>{tDetails("tasksName")}:</strong> {task.tasksName}
            </Typography>
          </Box>
        )}
        {!task && (
          <Typography textAlign="center" color="error">
            {tDetails("notFound")}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TasksDetailsDialog;
