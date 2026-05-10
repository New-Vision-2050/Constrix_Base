import { Box, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CARDTYPE } from ".";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { RowActions } from "./components/RowActions";
import EditWorkOrderDialog from "./components/dialogs/EditWorkOrderDialog";
import WorkOrderDetailsDialog from "./components/dialogs/WorkOrderDetailsDialog";
import type { ProjectSharingWorkOrder } from "./types";
import AddWorkOrderDialog from "./components/dialogs/AddWorkOrderDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectSharingWorkOrdersApi } from "@/services/api/projects/project-sharing-work-orders";
import DeleteButton from "@/components/shared/delete-button";

const WORK_ORDERS_QUERY_KEY = "project-sharing-work-orders";

const WorkOrderTypeTable =
  HeadlessTableLayout<ProjectSharingWorkOrder>("pswo");

export default function WorkOrderTypePage({
  setActiveCard,
  projectTypeId,
}: {
  setActiveCard: Dispatch<SetStateAction<CARDTYPE>>;
  projectTypeId: number;
}) {
  const t = useTranslations("projectSettings.workOrders");
  const tTable = useTranslations("projectSettings.workOrders.table");
  const tLabels = useTranslations("labels");
  const queryClient = useQueryClient();

  const [displayedRowId, setDisplayedRowId] = useState<string | null>(null);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingWorkOrderId, setDeletingWorkOrderId] = useState<number | null>(
    null,
  );

  const invalidateList = () =>
    queryClient.invalidateQueries({
      queryKey: [WORK_ORDERS_QUERY_KEY, projectTypeId],
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
    setDeletingWorkOrderId(Number(id));
    setDeleteDialogOpen(true);
  };

  const handleAdd = () => {
    setOpenAddDialog(true);
  };

  const params = WorkOrderTypeTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const { data: rows = [], isLoading, isError } = useQuery({
    queryKey: [WORK_ORDERS_QUERY_KEY, projectTypeId],
    queryFn: async () => {
      const res = await ProjectSharingWorkOrdersApi.list(projectTypeId);
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
        r.description.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q),
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
      name: tTable("consultantCode"),
      sortable: false,
      render: (row: ProjectSharingWorkOrder) => (
        <span className="p-2 text-sm">{row.code}</span>
      ),
    },
    {
      key: "type",
      name: tTable("workOrderType"),
      sortable: false,
      render: (row: ProjectSharingWorkOrder) => (
        <span className="p-2 text-sm">{row.type}</span>
      ),
    },
    {
      key: "description",
      name: tTable("workOrderDescription"),
      sortable: false,
      render: (row: ProjectSharingWorkOrder) => (
        <span className="p-2 text-sm">{row.description}</span>
      ),
    },
    {
      key: "actions",
      name: tTable("actions"),
      sortable: false,
      render: (row: ProjectSharingWorkOrder) => (
        <RowActions
          row={row}
          onShow={handleDisplay}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          canShow={true}
          canEdit={true}
          canDelete={true}
          translationNamespace="projectSettings.workOrders.table"
          editLabelKey="editWorkOrder"
        />
      ),
    },
  ];

  const tableState = WorkOrderTypeTable.useTableState({
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
          {tTable("addWorkOrder")}
        </Button>
      </Box>

      {isError ? (
        <Typography color="error" sx={{ mb: 2 }}>
          {t("loadListError")}
        </Typography>
      ) : null}

      <Box
        sx={{
          color: "text.primary",
        }}
      >
        <WorkOrderTypeTable
          filters={
            <WorkOrderTypeTable.TopActions state={tableState} />
          }
          table={
            <WorkOrderTypeTable.Table
              state={tableState}
              loadingOptions={{ rows: 5 }}
            />
          }
          pagination={<WorkOrderTypeTable.Pagination state={tableState} />}
        />
      </Box>

      <AddWorkOrderDialog
        open={openAddDialog}
        setOpenModal={setOpenAddDialog}
        projectTypeId={projectTypeId}
        onSuccess={invalidateList}
      />
      <WorkOrderDetailsDialog
        open={openModal}
        setOpenModal={setOpenModal}
        rowId={displayedRowId}
      />
      <EditWorkOrderDialog
        open={editDialogOpen && Boolean(editingRowId)}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingRowId(null);
        }}
        workOrderId={editingRowId ?? undefined}
        onSuccess={invalidateList}
      />

      <DeleteButton
        message={tTable("deleteConfirmMessage")}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onDelete={async () => {
          if (deletingWorkOrderId == null) {
            throw new Error("No work order selected");
          }
          await ProjectSharingWorkOrdersApi.delete(deletingWorkOrderId);
          setDeletingWorkOrderId(null);
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
