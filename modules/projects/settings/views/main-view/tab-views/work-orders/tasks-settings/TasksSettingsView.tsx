import { Box, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { CARDTYPE } from "../card-types";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { RowActions } from "../shared/RowActions";
import EditTasksSettingsDialog from "./dialogs/EditTasksSettingsDialog";
import TasksSettingsDetailsDialog from "./dialogs/TasksSettingsDetailsDialog";
import type { ProjectSharingTaskSetting } from "../shared/types";
import AddTasksSettingsDialog from "./dialogs/AddTasksSettingsDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectSharingTaskSettingApi } from "@/services/api/projects/project-sharing-tasks-setting";
import DeleteButton from "@/components/shared/delete-button";

const TASK_SETTINGS_QUERY_KEY = "project-sharing-tasks-setting";

const TasksSettingsTable =
  HeadlessTableLayout<ProjectSharingTaskSetting>("psts");

export default function TasksSettingsView({
  setActiveCard,
  projectTypeId,
}: {
  setActiveCard: Dispatch<SetStateAction<CARDTYPE>>;
  projectTypeId: number;
}) {
  const t = useTranslations("projectSettings.tasksSettings");
  const tTable = useTranslations("projectSettings.tasksSettings.table");
  const tLabels = useTranslations("labels");
  const queryClient = useQueryClient();

  const [displayedRowId, setDisplayedRowId] = useState<string | null>(null);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingSettingId, setDeletingSettingId] = useState<number | null>(
    null,
  );

  const invalidateList = () =>
    queryClient.invalidateQueries({
      queryKey: [TASK_SETTINGS_QUERY_KEY, projectTypeId],
    });

  const handleDisplay = (id: string) => {
    setDisplayedRowId(id);
    setOpenModal(true);
  };

  const handleEdit = (id: string) => {
    setEditingRowId(id);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingSettingId(Number(id));
    setDeleteDialogOpen(true);
  };

  const handleAdd = () => {
    setOpenAddDialog(true);
  };

  const params = TasksSettingsTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const {
    data: rows = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: [TASK_SETTINGS_QUERY_KEY, projectTypeId],
    queryFn: async () => {
      const res = await ProjectSharingTaskSettingApi.list(projectTypeId);
      return res.data.payload ?? [];
    },
    enabled: Number.isFinite(projectTypeId) && projectTypeId > 0,
  });

  const rowWorkOrderLabel = (row: ProjectSharingTaskSetting) => {
    const wo = row.order_permit;
    return wo ? `${wo.type}` : "—";
  };

  const rowTaskLabel = (row: ProjectSharingTaskSetting) => {
    const tk = row.order_permit_task;
    return tk ? `${tk.name}` : "—";
  };

  const filteredRows = useMemo(() => {
    const q = params.search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const wo = rowWorkOrderLabel(r).toLowerCase();
      const tk = rowTaskLabel(r).toLowerCase();
      return wo.includes(q) || tk.includes(q);
    });
  }, [rows, params.search]);

  const pageData = useMemo(() => {
    const start = (params.page - 1) * params.limit;
    return filteredRows.slice(start, start + params.limit);
  }, [filteredRows, params.page, params.limit]);

  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / params.limit) || 1);

  const columns = [
    {
      key: "workOrderType",
      name: tTable("workOrderType"),
      sortable: false,
      render: (row: ProjectSharingTaskSetting) => (
        <span className="p-2 text-sm">{rowWorkOrderLabel(row)}</span>
      ),
    },
    {
      key: "tasks",
      name: tTable("tasks"),
      sortable: false,
      render: (row: ProjectSharingTaskSetting) => (
        <span className="p-2 text-sm">{rowTaskLabel(row)}</span>
      ),
    },
    {
      key: "actions",
      name: tTable("actions"),
      sortable: false,
      render: (row: ProjectSharingTaskSetting) => (
        <RowActions
          row={row}
          onShow={handleDisplay}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          canShow={true}
          canEdit={true}
          canDelete={true}
          translationNamespace="projectSettings.tasksSettings.table"
          editLabelKey="editTasksSettings"
        />
      ),
    },
  ];

  const tableState = TasksSettingsTable.useTableState({
    data: pageData,
    columns,
    totalPages,
    totalItems,
    params,
    getRowId: (taskSetting) => String(taskSetting.id),
    loading: isLoading,
    searchable: true,
    filtered: params.search.trim().length > 0,
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
            sx={{ color: "text.primary" }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" color="text.primary">
            {t("title")}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ px: 6 }}
          onClick={handleAdd}
          disabled={!projectTypeId}
        >
          {tTable("addTasksSettings")}
        </Button>
      </Box>

      {isError ? (
        <Typography color="error" sx={{ mb: 2 }}>
          {t("loadListError")}
        </Typography>
      ) : null}

      <Box sx={{ color: "text.primary" }}>
        <TasksSettingsTable
          filters={<TasksSettingsTable.TopActions state={tableState} />}
          table={
            <TasksSettingsTable.Table
              state={tableState}
              loadingOptions={{ rows: 5 }}
            />
          }
          pagination={<TasksSettingsTable.Pagination state={tableState} />}
        />
      </Box>

      <AddTasksSettingsDialog
        open={openAddDialog}
        setOpenModal={setOpenAddDialog}
        projectTypeId={projectTypeId}
        onSuccess={invalidateList}
      />
      <TasksSettingsDetailsDialog
        open={openModal}
        setOpenModal={setOpenModal}
        rowId={displayedRowId}
        projectTypeId={projectTypeId}
      />
      <EditTasksSettingsDialog
        open={editDialogOpen && Boolean(editingRowId)}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingRowId(null);
        }}
        taskSettingId={editingRowId ?? undefined}
        projectTypeId={projectTypeId}
        onSuccess={invalidateList}
      />

      <DeleteButton
        message={tTable("deleteConfirmMessage")}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onDelete={async () => {
          if (deletingSettingId == null) {
            throw new Error("No task setting selected");
          }
          await ProjectSharingTaskSettingApi.delete(deletingSettingId);
          setDeletingSettingId(null);
          invalidateList();
        }}
        translations={{
          deleteSuccess: tTable("deleteSuccess"),
          deleteError: tTable("deleteError"),
          deleteCancelled: tLabels("deleteCancelled"),
        }}
      />
    </Box>
  );
}
