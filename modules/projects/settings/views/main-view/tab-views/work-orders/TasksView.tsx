import { Box, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CARDTYPE } from ".";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { RowActions } from "./components/RowActions";
import EditTasksDialog from "./components/dialogs/EditTasksDialog";
import TasksDetailsDialog from "./components/dialogs/TasksDetailsDialog";
import { Task } from "./types";
import AddTasksDialog from "./components/dialogs/AddTasksDialog";

const AddTasksTable = HeadlessTableLayout<Task>("psat");

export default function TasksView({
  setActiveCard,
}: {
  setActiveCard: Dispatch<SetStateAction<CARDTYPE>>;
}) {
  const t = useTranslations("projectSettings.addTasks");
  const tTable = useTranslations("projectSettings.addTasks.table");

  const [displayedRowId, setDisplayedRowId] = useState<string | null>(null);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleDisplay = (id: string) => {
    setDisplayedRowId(id);
    setOpenModal(true);
  };
  const handleEdit = (id: string) => {
    setEditingRowId(id);
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    setOpenAddDialog(true);
  };

  const params = AddTasksTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const tasks = [
    { id: "task1", tasksNumber: 1, tasksName: "مهمة أولى" },
    { id: "task2", tasksNumber: 2, tasksName: "مهمة ثانية" },
    { id: "task3", tasksNumber: 3, tasksName: "مهمة ثالثة" },
    { id: "task4", tasksNumber: 4, tasksName: "مهمة رابعة" },
  ];

  const columns = [
    {
      key: "tasksNumber",
      name: tTable("tasksNumber"),
      sortable: false,
      render: (row: Task) => (
        <span className="p-2 text-sm">{row.tasksNumber}</span>
      ),
    },
    {
      key: "tasksName",
      name: tTable("tasksName"),
      sortable: false,
      render: (row: Task) => (
        <span className="p-2 text-sm">{row.tasksName}</span>
      ),
    },
    {
      key: "actions",
      name: tTable("actions"),
      sortable: false,
      render: (row: Task) => (
        <RowActions
          row={row}
          onShow={handleDisplay}
          onEdit={handleEdit}
          canShow={true}
          canEdit={true}
          translationNamespace="projectSettings.addTasks.table"
          editLabelKey="editTask"
        />
      ),
    },
  ];

  const tableState = AddTasksTable.useTableState({
    data: tasks,
    columns,
    totalPages: 1,
    totalItems: 10,
    params,
    getRowId: (task) => task.id,
    loading: false,
    searchable: false,
    filtered: params.search !== "",
  });

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={() => setActiveCard("HIDE")}
            sx={{ color: "white" }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" color="white">
            {t("title")}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ px: 6 }}
            onClick={handleAdd}
          >
            {tTable("addTask")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ px: 6 }}
            onClick={() => setActiveCard("TASKS_SETTINGS")}
          >
            {t("settings")}
          </Button>
        </Box>
      </Box>

      <Box sx={{ color: "white" }}>
        <AddTasksTable
          table={
            <AddTasksTable.Table
              state={tableState}
              loadingOptions={{ rows: 5 }}
            />
          }
        />
      </Box>

      <AddTasksDialog open={openAddDialog} setOpenModal={setOpenAddDialog} />
      <TasksDetailsDialog
        open={openModal}
        setOpenModal={setOpenModal}
        rowId={displayedRowId}
      />
      <EditTasksDialog
        open={editDialogOpen || Boolean(editingRowId)}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingRowId(null);
        }}
        taskId={editingRowId || undefined}
      />
    </Box>
  );
}
