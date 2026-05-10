import { Box, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { CARDTYPE } from "../card-types";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { RowActions } from "../shared/RowActions";
import EditActionsDialog from "./dialogs/EditActionsDialog";
import ActionsDetailsDialog from "./dialogs/ActionsDetailsDialog";
import type { ProjectSharingProcedure } from "../shared/types";
import AddActionsDialog from "./dialogs/AddActionsDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectSharingProcedureApi } from "@/services/api/projects/project-sharing-procedure";
import DeleteButton from "@/components/shared/delete-button";

const PROCEDURES_QUERY_KEY = "project-sharing-procedure";

const ActionsTable = HeadlessTableLayout<ProjectSharingProcedure>("psact");

export default function ActionsView({
  setActiveCard,
  projectTypeId,
}: {
  setActiveCard: Dispatch<SetStateAction<CARDTYPE>>;
  projectTypeId: number;
}) {
  const t = useTranslations("projectSettings.actions");
  const tTable = useTranslations("projectSettings.actions.table");
  const tLabels = useTranslations("labels");
  const queryClient = useQueryClient();

  const [displayedRowId, setDisplayedRowId] = useState<string | null>(null);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProcedureId, setDeletingProcedureId] = useState<number | null>(
    null,
  );

  const invalidateList = () =>
    queryClient.invalidateQueries({
      queryKey: [PROCEDURES_QUERY_KEY, projectTypeId],
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
    setDeletingProcedureId(Number(id));
    setDeleteDialogOpen(true);
  };

  const handleAdd = () => {
    setOpenAddDialog(true);
  };

  const params = ActionsTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const { data: rows = [], isLoading, isError } = useQuery({
    queryKey: [PROCEDURES_QUERY_KEY, projectTypeId],
    queryFn: async () => {
      const res = await ProjectSharingProcedureApi.list(projectTypeId);
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
        r.description.toLowerCase().includes(q),
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
      render: (row: ProjectSharingProcedure) => (
        <span className="p-2 text-sm">{row.code}</span>
      ),
    },
    {
      key: "description",
      name: tTable("description"),
      sortable: false,
      render: (row: ProjectSharingProcedure) => (
        <span className="p-2 text-sm">{row.description}</span>
      ),
    },
    {
      key: "actions",
      name: tTable("actions"),
      sortable: false,
      render: (row: ProjectSharingProcedure) => (
        <RowActions
          row={row}
          onShow={handleDisplay}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          canShow={true}
          canEdit={true}
          canDelete={true}
          translationNamespace="projectSettings.actions.table"
          editLabelKey="editAction"
        />
      ),
    },
  ];

  const tableState = ActionsTable.useTableState({
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
        <Button
          variant="contained"
          color="primary"
          sx={{ px: 6 }}
          onClick={handleAdd}
          disabled={!projectTypeId}
        >
          {tTable("addAction")}
        </Button>
      </Box>

      {isError ? (
        <Typography color="error" sx={{ mb: 2 }}>
          {t("loadListError")}
        </Typography>
      ) : null}

      <Box sx={{ color: "text.primary" }}>
        <ActionsTable
          filters={<ActionsTable.TopActions state={tableState} />}
          table={
            <ActionsTable.Table
              state={tableState}
              loadingOptions={{ rows: 5 }}
            />
          }
          pagination={<ActionsTable.Pagination state={tableState} />}
        />
      </Box>

      <AddActionsDialog
        open={openAddDialog}
        setOpenModal={setOpenAddDialog}
        projectTypeId={projectTypeId}
        onSuccess={invalidateList}
      />
      <ActionsDetailsDialog
        open={openModal}
        setOpenModal={setOpenModal}
        rowId={displayedRowId}
      />
      <EditActionsDialog
        open={editDialogOpen && Boolean(editingRowId)}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingRowId(null);
        }}
        actionId={editingRowId ?? undefined}
        onSuccess={invalidateList}
      />

      <DeleteButton
        message={tTable("deleteConfirmMessage")}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onDelete={async () => {
          if (deletingProcedureId == null) {
            throw new Error("No procedure selected");
          }
          await ProjectSharingProcedureApi.delete(deletingProcedureId);
          setDeletingProcedureId(null);
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
