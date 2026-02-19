import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DetailsDialogProps, TasksType } from "../types";
import HeadlessTableLayout from "@/components/headless/table";

const TasksTypeTable = HeadlessTableLayout<TasksType>("wott");

const DetailsDialog = ({
  open,
  setOpenModal,
  rowId,
  action,
}: DetailsDialogProps) => {
  const handleClose = () => setOpenModal(false);

  // Dummy data
  const tasks: TasksType[] = [
    { id: "401", desc: "تركيب عداد" },
    { id: "402", desc: "ضخ وتمديد" },
    { id: "403", desc: "سيفتي - قص - ضخ - تمديد" },
  ];

  const columns = [
    {
      key: "id",
      name: "الرقم",
      sortable: false,
      render: (row: TasksType) => <span className="py-2">{row.id}</span>,
    },
    {
      key: "description",
      name: "الوصف",
      sortable: false,
      render: (row: TasksType) => <span className="py-2">{row.desc}</span>,
    },
  ];

  const params = TasksTypeTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const tableState = TasksTypeTable.useTableState({
    data: tasks,
    columns,
    totalPages: 1,
    totalItems: 10,
    params,
    getRowId: (task) => task.id,
    loading: false,
    searchable: true,
    filtered: params.search !== "",
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={"lg"}
      PaperProps={{
        sx: {
          color: "white",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          p: 8,
        },
      }}
    >
      <IconButton
        onClick={handleClose}
        sx={{
          position: "absolute",
          left: 16,
          top: 16,
          color: "rgba(255,255,255,0.5)",
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
        {action == "display" ? "عرض نوع أمر العمل" : "تعديل نوع أمر العمل"}
        {rowId}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Typography textAlign="center" sx={{ mb: 2 }}>
              مهام امر العمل
            </Typography>
            <Box
              sx={{
                color: "white",
              }}
            >
              <TasksTypeTable
                table={
                  <TasksTypeTable.Table
                    state={tableState}
                    loadingOptions={{ rows: 5 }}
                  />
                }
              />
            </Box>
          </Grid>
          <Grid size={6}>
            <Typography textAlign="center" sx={{ mb: 2 }}>
              اجراءات امر العمل
            </Typography>
            {/* <InnerTable tableState={tableState} /> */}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsDialog;
