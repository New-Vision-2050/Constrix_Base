import { Box, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CARDTYPE } from ".";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { RowActions } from "./components/RowActions";
import EditWorkOrderDialog from "./components/dialogs/EditWorkOrderDialog";
import WorkOrderDetailsDialog from "./components/dialogs/WorkOrderDetailsDialog";
import { WorkOrderType } from "./types";
import AddWorkOrderDialog from "./components/dialogs/AddWorkOrderDialog";

const WorkOrderTypeTable = HeadlessTableLayout<WorkOrderType>("pswo");

export default function WorkOrderTypePage({
  setActiveCard,
}: {
  setActiveCard: Dispatch<SetStateAction<CARDTYPE>>;
}) {
  const t = useTranslations("projectSettings.workOrders");
  const tTable = useTranslations("projectSettings.workOrders.table");

  const [displayedRowId, setDisplayedRowId] = useState<string | null>(null);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);//details dialog
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

  const params = WorkOrderTypeTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const WorkOrderType = [
    {
      id: "id124",
      consultantCode: 400,
      description: "a desc",
      type: 420,
      workOrderDescription: "توصيل عداد بحفرية شبكة ارضية",
      workOrderType: 402,
      taskId: "task1",
      procedureId: "proc1",
    },
    {
      id: "id125",
      consultantCode: 401,
      description: "a sec desc",
      type: 421,
      workOrderDescription: "Second work order description",
      workOrderType: 403,
      taskId: "task2",
      procedureId: "proc2",
    },
    {
      id: "id126",
      consultantCode: 402,
      description: "a Third desc",
      type: 422,
      workOrderDescription: "Third work order description",
      workOrderType: 404,
      taskId: "task3",
      procedureId: "proc3",
    },
    {
      id: "id127",
      consultantCode: 403,
      description: "a fourth desc",
      type: 423,
      workOrderDescription: "Fourth work order description",
      workOrderType: 405,
      taskId: "task1",
      procedureId: "proc2",
    },
  ];

  const columns = [
    {
      key: "consultantcode",
      name: tTable("consultantCode"),
      sortable: false,
      render: (row: WorkOrderType) => (
        <span className="p-2 text-sm">{row.consultantCode}</span>
      ),
    },
    {
      key: "workordertype",
      name: tTable("workOrderType"),
      sortable: false,
      render: (row: WorkOrderType) => (
        <span className="p-2 text-sm">{row.workOrderType || row.type}</span>
      ),
    },
    {
      key: "workorderdescription",
      name: tTable("workOrderDescription"),
      sortable: false,
      render: (row: WorkOrderType) => (
        <span className="p-2 text-sm">{row.workOrderDescription || row.description}</span>
      ),
    },
    {
      key: "actions",
      name: tTable("actions"),
      sortable: false,
      render: (row: WorkOrderType) => (
        <RowActions
          row={row}
          onShow={handleDisplay}
          onEdit={handleEdit}
          canShow={true}
          canEdit={true}
          translationNamespace="projectSettings.workOrders.table"
          editLabelKey="editWorkOrder"
        />
      ),
    },
  ];

  const tableState = WorkOrderTypeTable.useTableState({
    data: WorkOrderType,
    columns,
    totalPages: 1,
    totalItems: 10,
    params,
    getRowId: (workOrderType) => workOrderType.id,
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
        <Button variant="contained" color="primary" sx={{ px: 6 }} onClick={handleAdd}>
          {tTable("addWorkOrder")}
        </Button>
      </Box>

      <Box
        sx={{
          color: "white",
        }}
      >
        <WorkOrderTypeTable
          table={
            <WorkOrderTypeTable.Table
              state={tableState}
              loadingOptions={{ rows: 5 }}
            ></WorkOrderTypeTable.Table>
          }
        />
      </Box>


      <AddWorkOrderDialog open={openAddDialog} setOpenModal={setOpenAddDialog} />
      <WorkOrderDetailsDialog
        open={openModal}
        setOpenModal={setOpenModal}
        rowId={displayedRowId}
      />
      <EditWorkOrderDialog
        open={editDialogOpen || Boolean(editingRowId)}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingRowId(null);
        }}
        workOrderId={editingRowId || undefined}
      />
    </Box>
  );
}
