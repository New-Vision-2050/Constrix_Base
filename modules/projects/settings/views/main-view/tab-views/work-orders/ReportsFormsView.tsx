import { Box, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CARDTYPE } from ".";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { RowActions } from "./components/RowActions";
import EditReportFormDialog from "./components/dialogs/EditReportFormDialog";
import ReportFormDetailsDialog from "./components/dialogs/ReportFormDetailsDialog";
import { ReportForm } from "./types";
import AddReportFormDialog from "./components/dialogs/AddReportFormDialog";

const ReportFormsTable = HeadlessTableLayout<ReportForm>("psrf");

export default function ReportsFormsView({
  setActiveCard,
}: {
  setActiveCard: Dispatch<SetStateAction<CARDTYPE>>;
}) {
  const t = useTranslations("projectSettings.reportForms");
  const tTable = useTranslations("projectSettings.reportForms.table");

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

  const params = ReportFormsTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const reportForms = [
    {
      id: "rf1",
      referenceNumber: "REF-001",
      formName: "نموذج التقرير الأول",
      workOrderType: "نوع أمر العمل 1",
      notes: "ملاحظات أولى",
    },
    {
      id: "rf2",
      referenceNumber: "REF-002",
      formName: "نموذج التقرير الثاني",
      workOrderType: "نوع أمر العمل 2",
      notes: "ملاحظات ثانية",
    },
    {
      id: "rf3",
      referenceNumber: "REF-003",
      formName: "نموذج التقرير الثالث",
      workOrderType: "نوع أمر العمل 3",
      notes: "ملاحظات ثالثة",
    },
  ];

  const columns = [
    {
      key: "referenceNumber",
      name: tTable("referenceNumber"),
      sortable: false,
      render: (row: ReportForm) => (
        <span className="p-2 text-sm">{row.referenceNumber}</span>
      ),
    },
    {
      key: "formName",
      name: tTable("formName"),
      sortable: false,
      render: (row: ReportForm) => (
        <span className="p-2 text-sm">{row.formName}</span>
      ),
    },
    {
      key: "workOrderType",
      name: tTable("workOrderType"),
      sortable: false,
      render: (row: ReportForm) => (
        <span className="p-2 text-sm">{row.workOrderType}</span>
      ),
    },
    {
      key: "notes",
      name: tTable("notes"),
      sortable: false,
      render: (row: ReportForm) => (
        <span className="p-2 text-sm">{row.notes}</span>
      ),
    },
    {
      key: "actions",
      name: tTable("actions"),
      sortable: false,
      render: (row: ReportForm) => (
        <RowActions
          row={row}
          onShow={handleDisplay}
          onEdit={handleEdit}
          canShow={true}
          canEdit={true}
          translationNamespace="projectSettings.reportForms.table"
          editLabelKey="editReportForm"
        />
      ),
    },
  ];

  const tableState = ReportFormsTable.useTableState({
    data: reportForms,
    columns,
    totalPages: 1,
    totalItems: 10,
    params,
    getRowId: (reportForm) => reportForm.id,
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
          {tTable("addReportForm")}
        </Button>
      </Box>

      <Box sx={{ color: "white" }}>
        <ReportFormsTable
          table={
            <ReportFormsTable.Table
              state={tableState}
              loadingOptions={{ rows: 5 }}
            />
          }
        />
      </Box>

      <AddReportFormDialog
        open={openAddDialog}
        setOpenModal={setOpenAddDialog}
      />
      <ReportFormDetailsDialog
        open={openModal}
        setOpenModal={setOpenModal}
        rowId={displayedRowId}
      />
      <EditReportFormDialog
        open={editDialogOpen || Boolean(editingRowId)}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingRowId(null);
        }}
        reportFormId={editingRowId || undefined}
      />
    </Box>
  );
}
