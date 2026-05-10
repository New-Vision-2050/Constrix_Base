import { Box, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { CARDTYPE } from "../card-types";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { RowActions } from "../shared/RowActions";
import EditReportFormDialog from "./dialogs/EditReportFormDialog";
import ReportFormDetailsDialog from "./dialogs/ReportFormDetailsDialog";
import type {
  ProjectSharingReportForm,
  ProjectSharingWorkOrder,
} from "../shared/types";
import AddReportFormDialog from "./dialogs/AddReportFormDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ReportFormsApi } from "@/services/api/projects/report-forms";
import { ProjectSharingWorkOrdersApi } from "@/services/api/projects/project-sharing-work-orders";
import DeleteButton from "@/components/shared/delete-button";

const REPORT_FORMS_QUERY_KEY = "report-forms";
const WORK_ORDERS_QUERY_KEY = "project-sharing-work-orders";

const ReportFormsTable = HeadlessTableLayout<ProjectSharingReportForm>("psrf");

export default function ReportsFormsView({
  setActiveCard,
  projectTypeId,
}: {
  setActiveCard: Dispatch<SetStateAction<CARDTYPE>>;
  projectTypeId: number;
}) {
  const t = useTranslations("projectSettings.reportForms");
  const tTable = useTranslations("projectSettings.reportForms.table");
  const tLabels = useTranslations("labels");
  const queryClient = useQueryClient();

  const [displayedRowId, setDisplayedRowId] = useState<string | null>(null);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingFormId, setDeletingFormId] = useState<number | null>(null);

  const invalidateList = () =>
    queryClient.invalidateQueries({
      queryKey: [REPORT_FORMS_QUERY_KEY, projectTypeId],
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
    setDeletingFormId(Number(id));
    setDeleteDialogOpen(true);
  };

  const handleAdd = () => {
    setOpenAddDialog(true);
  };

  const params = ReportFormsTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const { data: workOrders = [] } = useQuery({
    queryKey: [WORK_ORDERS_QUERY_KEY, projectTypeId],
    queryFn: async () => {
      const res = await ProjectSharingWorkOrdersApi.list(projectTypeId);
      return res.data.payload ?? [];
    },
    enabled: Number.isFinite(projectTypeId) && projectTypeId > 0,
  });

  const workOrderById = useMemo(() => {
    const m = new Map<number, ProjectSharingWorkOrder>();
    for (const wo of workOrders) {
      m.set(wo.id, wo);
    }
    return m;
  }, [workOrders]);

  const { data: rows = [], isLoading, isError } = useQuery({
    queryKey: [REPORT_FORMS_QUERY_KEY, projectTypeId],
    queryFn: async () => {
      const res = await ReportFormsApi.list(projectTypeId);
      return res.data.payload ?? [];
    },
    enabled: Number.isFinite(projectTypeId) && projectTypeId > 0,
  });

  const filteredRows = useMemo(() => {
    const q = params.search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const woCode =
        workOrderById.get(r.project_sharing_work_order_id)?.code ?? "";
      const hay = [
        r.name,
        r.question,
        r.value,
        r.notes ?? "",
        woCode,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [rows, params.search, workOrderById]);

  const pageData = useMemo(() => {
    const start = (params.page - 1) * params.limit;
    return filteredRows.slice(start, start + params.limit);
  }, [filteredRows, params.page, params.limit]);

  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / params.limit) || 1);

  const columns = [
    {
      key: "name",
      name: tTable("formName"),
      sortable: false,
      render: (row: ProjectSharingReportForm) => (
        <span className="p-2 text-sm">{row.name}</span>
      ),
    },
    {
      key: "workOrder",
      name: tTable("workOrderType"),
      sortable: false,
      render: (row: ProjectSharingReportForm) => (
        <span className="p-2 text-sm">
          {workOrderById.get(row.project_sharing_work_order_id)?.code ?? "—"}
        </span>
      ),
    },
    {
      key: "question",
      name: tTable("question"),
      sortable: false,
      render: (row: ProjectSharingReportForm) => (
        <span className="p-2 text-sm line-clamp-2">{row.question}</span>
      ),
    },
    {
      key: "value",
      name: tTable("value"),
      sortable: false,
      render: (row: ProjectSharingReportForm) => (
        <span className="p-2 text-sm">{row.value}</span>
      ),
    },
    {
      key: "actions",
      name: tTable("actions"),
      sortable: false,
      render: (row: ProjectSharingReportForm) => (
        <RowActions
          row={row}
          onShow={handleDisplay}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          canShow={true}
          canEdit={true}
          canDelete={true}
          translationNamespace="projectSettings.reportForms.table"
          editLabelKey="editReportForm"
        />
      ),
    },
  ];

  const tableState = ReportFormsTable.useTableState({
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
          {tTable("addReportForm")}
        </Button>
      </Box>

      {isError ? (
        <Typography color="error" sx={{ mb: 2 }}>
          {t("loadListError")}
        </Typography>
      ) : null}

      <Box sx={{ color: "text.primary" }}>
        <ReportFormsTable
          filters={<ReportFormsTable.TopActions state={tableState} />}
          table={
            <ReportFormsTable.Table
              state={tableState}
              loadingOptions={{ rows: 5 }}
            />
          }
          pagination={<ReportFormsTable.Pagination state={tableState} />}
        />
      </Box>

      <AddReportFormDialog
        open={openAddDialog}
        setOpenModal={setOpenAddDialog}
        projectTypeId={projectTypeId}
        onSuccess={invalidateList}
      />
      <ReportFormDetailsDialog
        open={openModal}
        setOpenModal={setOpenModal}
        rowId={displayedRowId}
        projectTypeId={projectTypeId}
      />
      <EditReportFormDialog
        open={editDialogOpen && Boolean(editingRowId)}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingRowId(null);
        }}
        reportFormId={editingRowId ?? undefined}
        projectTypeId={projectTypeId}
        onSuccess={invalidateList}
      />

      <DeleteButton
        message={tTable("deleteConfirmMessage")}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onDelete={async () => {
          if (deletingFormId == null) {
            throw new Error("No report form selected");
          }
          await ReportFormsApi.delete(deletingFormId);
          setDeletingFormId(null);
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
