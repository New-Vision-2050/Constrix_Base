import { Box, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { CARDTYPE } from "../card-types";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { RowActions } from "../shared/RowActions";
import EditTasksDialog from "./dialogs/EditTasksDialog";
import TasksDetailsDialog from "./dialogs/TasksDetailsDialog";
import type { ProjectSharingTask } from "../shared/types";
import AddTasksDialog from "./dialogs/AddTasksDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectSharingTasksApi } from "@/services/api/projects/project-sharing-tasks";
import DeleteButton from "@/components/shared/delete-button";

const TASKS_QUERY_KEY = "project-sharing-tasks";

const AddTasksTable = HeadlessTableLayout<ProjectSharingTask>("psat");

export default function TasksView({
  setActiveCard,
  projectTypeId,
}: {
  setActiveCard: Dispatch<SetStateAction<CARDTYPE>>;
  projectTypeId: number;
}) {
  const t = useTranslations("projectSettings.addTasks");
  const tTable = useTranslations("projectSettings.addTasks.table");
  const tLabels = useTranslations("labels");
  const queryClient = useQueryClient();

  const [displayedRowId, setDisplayedRowId] = useState<string | null>(null);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

  const invalidateList = () =>
    queryClient.invalidateQueries({
      queryKey: [TASKS_QUERY_KEY, projectTypeId],
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
    setDeletingTaskId(Number(id));
    setDeleteDialogOpen(true);
  };

  const handleAdd = () => {
    setOpenAddDialog(true);
  };

  const params = AddTasksTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const { data: rows = [], isLoading, isError } = useQuery({
    queryKey: [TASKS_QUERY_KEY, projectTypeId],
    queryFn: async () => {
      const res = await ProjectSharingTasksApi.list(projectTypeId);
      return res.data.payload ?? [];
    },
    enabled: Number.isFinite(projectTypeId) && projectTypeId > 0,
  });

  const filteredRows = useMemo(() => {
    const q = params.search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.code.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q),
    );
  }, [rows, params.search]);

  const pageData = useMemo(() => {
    const start = (params.page - 1) * params.limit;
    return filteredRows.slice(start, start + params.limit);
  }, [filteredRows, params.page, params.limit]);

  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / params.limit) || 1);

  const columns = [
    {
      key: "code",
      name: tTable("code"),
      sortable: false,
      render: (row: ProjectSharingTask) => (
        <span className="p-2 text-sm">{row.code}</span>
      ),
    },
    {
      key: "name",
      name: tTable("tasksName"),
      sortable: false,
      render: (row: ProjectSharingTask) => (
        <span className="p-2 text-sm">{row.name}</span>
      ),
    },
    {
      key: "actions",
      name: tTable("actions"),
      sortable: false,
      render: (row: ProjectSharingTask) => (
        <RowActions
          row={row}
          onShow={handleDisplay}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          canShow={true}
          canEdit={true}
          canDelete={true}
          translationNamespace="projectSettings.addTasks.table"
          editLabelKey="editTask"
        />
      ),
    },
  ];

  const tableState = AddTasksTable.useTableState({
    data: pageData,
    columns,
    totalPages,
    totalItems,
    params,
    getRowId: (row) => String(row.id),
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
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ px: 6 }}
            onClick={handleAdd}
            disabled={!projectTypeId}
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

      {isError ? (
        <Typography color="error" sx={{ mb: 2 }}>
          {t("loadListError")}
        </Typography>
      ) : null}

      <Box sx={{ color: "text.primary" }}>
        <AddTasksTable
          filters={<AddTasksTable.TopActions state={tableState} />}
          table={
            <AddTasksTable.Table
              state={tableState}
              loadingOptions={{ rows: 5 }}
            />
          }
          pagination={<AddTasksTable.Pagination state={tableState} />}
        />
      </Box>

      <AddTasksDialog
        open={openAddDialog}
        setOpenModal={setOpenAddDialog}
        projectTypeId={projectTypeId}
        onSuccess={invalidateList}
      />
      <TasksDetailsDialog
        open={openModal}
        setOpenModal={setOpenModal}
        rowId={displayedRowId}
      />
      <EditTasksDialog
        open={editDialogOpen && Boolean(editingRowId)}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingRowId(null);
        }}
        taskId={editingRowId ?? undefined}
        onSuccess={invalidateList}
      />

      <DeleteButton
        message={tTable("deleteConfirmMessage")}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onDelete={async () => {
          if (deletingTaskId == null) {
            throw new Error("No task selected");
          }
          await ProjectSharingTasksApi.delete(deletingTaskId);
          setDeletingTaskId(null);
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
