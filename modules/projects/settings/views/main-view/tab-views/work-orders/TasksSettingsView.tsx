import { Box, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CARDTYPE } from ".";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { RowActions } from "./components/RowActions";
import EditTasksSettingsDialog from "./components/dialogs/EditTasksSettingsDialog";
import TasksSettingsDetailsDialog from "./components/dialogs/TasksSettingsDetailsDialog";
import { TaskSetting } from "./types";
import AddTasksSettingsDialog from "./components/dialogs/AddTasksSettingsDialog";

const TasksSettingsTable = HeadlessTableLayout<TaskSetting>("psts");

export default function TasksSettingsView({
  setActiveCard,
}: {
  setActiveCard: Dispatch<SetStateAction<CARDTYPE>>;
}) {
  const t = useTranslations("projectSettings.tasksSettings");
  const tTable = useTranslations("projectSettings.tasksSettings.table");

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

  const params = TasksSettingsTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const tasksSettings = [
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

  const columns = [
    {
      key: "workOrderType",
      name: tTable("workOrderType"),
      sortable: false,
      render: (row: TaskSetting) => (
        <span className="p-2 text-sm">{row.workOrderType}</span>
      ),
    },
    {
      key: "tasks",
      name: tTable("tasks"),
      sortable: false,
      render: (row: TaskSetting) => (
        <span className="p-2 text-sm">{row.tasks}</span>
      ),
    },
    {
      key: "actions",
      name: tTable("actions"),
      sortable: false,
      render: (row: TaskSetting) => (
        <RowActions
          row={row}
          onShow={handleDisplay}
          onEdit={handleEdit}
          canShow={true}
          canEdit={true}
          translationNamespace="projectSettings.tasksSettings.table"
          editLabelKey="editTasksSettings"
        />
      ),
    },
  ];

  const tableState = TasksSettingsTable.useTableState({
    data: tasksSettings,
    columns,
    totalPages: 1,
    totalItems: 10,
    params,
    getRowId: (taskSetting) => taskSetting.id,
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
        <Button
          variant="contained"
          color="primary"
          sx={{ px: 6 }}
          onClick={handleAdd}
        >
          {tTable("addTasksSettings")}
        </Button>
      </Box>

      <Box sx={{ color: "white" }}>
        <TasksSettingsTable
          table={
            <TasksSettingsTable.Table
              state={tableState}
              loadingOptions={{ rows: 5 }}
            />
          }
        />
      </Box>

      <AddTasksSettingsDialog
        open={openAddDialog}
        setOpenModal={setOpenAddDialog}
      />
      <TasksSettingsDetailsDialog
        open={openModal}
        setOpenModal={setOpenModal}
        rowId={displayedRowId}
      />
      <EditTasksSettingsDialog
        open={editDialogOpen || Boolean(editingRowId)}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingRowId(null);
        }}
        taskSettingId={editingRowId || undefined}
      />
    </Box>
  );
}
