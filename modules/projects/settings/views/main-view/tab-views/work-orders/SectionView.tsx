import { Box, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CARDTYPE } from ".";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { RowActions } from "./components/RowActions";
import EditSectionDialog from "./components/dialogs/EditSectionDialog";
import SectionDetailsDialog from "./components/dialogs/SectionDetailsDialog";
import type { ProjectSharingDepartment } from "./types";
import AddSectionDialog from "./components/dialogs/AddSectionDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectSharingDepartmentApi } from "@/services/api/projects/project-sharing-department";
import DeleteButton from "@/components/shared/delete-button";

const DEPARTMENTS_QUERY_KEY = "project-sharing-department";

const SectionTable = HeadlessTableLayout<ProjectSharingDepartment>("pssec");

export default function SectionView({
  setActiveCard,
  projectTypeId,
}: {
  setActiveCard: Dispatch<SetStateAction<CARDTYPE>>;
  projectTypeId: number;
}) {
  const t = useTranslations("projectSettings.section");
  const tTable = useTranslations("projectSettings.section.table");
  const tLabels = useTranslations("labels");
  const queryClient = useQueryClient();

  const [displayedRowId, setDisplayedRowId] = useState<string | null>(null);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDepartmentId, setDeletingDepartmentId] = useState<
    number | null
  >(null);

  const invalidateList = () =>
    queryClient.invalidateQueries({
      queryKey: [DEPARTMENTS_QUERY_KEY, projectTypeId],
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
    setDeletingDepartmentId(Number(id));
    setDeleteDialogOpen(true);
  };

  const handleAdd = () => {
    setOpenAddDialog(true);
  };

  const params = SectionTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const { data: rows = [], isLoading, isError } = useQuery({
    queryKey: [DEPARTMENTS_QUERY_KEY, projectTypeId],
    queryFn: async () => {
      const res = await ProjectSharingDepartmentApi.list(projectTypeId);
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
      render: (row: ProjectSharingDepartment) => (
        <span className="p-2 text-sm">{row.code}</span>
      ),
    },
    {
      key: "description",
      name: tTable("description"),
      sortable: false,
      render: (row: ProjectSharingDepartment) => (
        <span className="p-2 text-sm">{row.description}</span>
      ),
    },
    {
      key: "actions",
      name: tTable("actions"),
      sortable: false,
      render: (row: ProjectSharingDepartment) => (
        <RowActions
          row={row}
          onShow={handleDisplay}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          canShow={true}
          canEdit={true}
          canDelete={true}
          translationNamespace="projectSettings.section.table"
          editLabelKey="editSection"
        />
      ),
    },
  ];

  const tableState = SectionTable.useTableState({
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
          {tTable("addSection")}
        </Button>
      </Box>

      {isError ? (
        <Typography color="error" sx={{ mb: 2 }}>
          {t("loadListError")}
        </Typography>
      ) : null}

      <Box sx={{ color: "text.primary" }}>
        <SectionTable
          filters={<SectionTable.TopActions state={tableState} />}
          table={
            <SectionTable.Table
              state={tableState}
              loadingOptions={{ rows: 5 }}
            />
          }
          pagination={<SectionTable.Pagination state={tableState} />}
        />
      </Box>

      <AddSectionDialog
        open={openAddDialog}
        setOpenModal={setOpenAddDialog}
        projectTypeId={projectTypeId}
        onSuccess={invalidateList}
      />
      <SectionDetailsDialog
        open={openModal}
        setOpenModal={setOpenModal}
        rowId={displayedRowId}
      />
      <EditSectionDialog
        open={editDialogOpen && Boolean(editingRowId)}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingRowId(null);
        }}
        sectionId={editingRowId ?? undefined}
        onSuccess={invalidateList}
      />

      <DeleteButton
        message={tTable("deleteConfirmMessage")}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onDelete={async () => {
          if (deletingDepartmentId == null) {
            throw new Error("No department selected");
          }
          await ProjectSharingDepartmentApi.delete(deletingDepartmentId);
          setDeletingDepartmentId(null);
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
