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

const mockTasksSettings = [
  {
    id: "ts1",
    workOrderType: "نوع أمر العمل 1",
    tasks: "مهمة أولى، مهمة ثانية",
  },
  {
    id: "ts2",
    workOrderType: "نوع أمر العمل 2",
    tasks: "مهمة ثانية، مهمة ثالثة",
  },
  {
    id: "ts3",
    workOrderType: "نوع أمر العمل 3",
    tasks: "مهمة أولى، مهمة رابعة",
  },
];

const TasksSettingsDetailsDialog = ({
  open,
  setOpenModal,
  rowId,
}: DetailsDialogProps) => {
  const tDetails = useTranslations("projectSettings.tasksSettings.details");
  const handleClose = () => setOpenModal(false);

  const taskSetting = mockTasksSettings.find((item) => item.id === rowId);

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
        {taskSetting && (
          <Box className="flex flex-col gap-4">
            <Typography variant="body1">
              <strong>{tDetails("workOrderType")}:</strong>{" "}
              {taskSetting.workOrderType}
            </Typography>
            <Typography variant="body1">
              <strong>{tDetails("tasks")}:</strong> {taskSetting.tasks}
            </Typography>
          </Box>
        )}
        {!taskSetting && (
          <Typography textAlign="center" color="error">
            {tDetails("notFound")}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TasksSettingsDetailsDialog;
