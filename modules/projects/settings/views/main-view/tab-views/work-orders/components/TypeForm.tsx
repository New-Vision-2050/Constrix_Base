import { Box, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CARDTYPE } from "..";
import { Dispatch, SetStateAction, useState } from "react";
import HeadlessTableLayout from "@/components/headless/table";
import { ActionType, WorkOrderType } from "../types";
import { RowActions } from "./RowActions";
import DetailsDialog from "./DetailsDialog";

const WorkOrderTypeTable = HeadlessTableLayout<WorkOrderType>("pswo");

export default function WorkOrderTypeForm({
  setActiveCard,
}: {
  setActiveCard: Dispatch<SetStateAction<CARDTYPE>>;
}) {
  const [displayedRowId, setDisplayedRowId] = useState<string | null>(null);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [actionType, setActionType] = useState<ActionType | null>(null);

  const handleDisplay = (id: string) => {
    setActionType("display");
    setDisplayedRowId(id);
    setOpenModal(true);
    // console.log("displayedRowId", id);
  };
  const handleEdit = (id: string) => {
    setActionType("edit");
    setEditingRowId(id);
    setOpenModal(true);
    // console.log("editingRowId", id);
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
    },
    {
      id: "id125",
      consultantCode: 401,
      description: "a sec desc",
      type: 421,
    },
    {
      id: "id126",
      consultantCode: 402,
      description: "a Third desc",
      type: 422,
    },
    {
      id: "id127",
      consultantCode: 403,
      description: "a fourth desc",
      type: 423,
    },
  ];

  const columns = [
    {
      key: "consultantcode",
      name: "Consultant Code",
      sortable: false,
      render: (row: WorkOrderType) => (
        <span className="p-2 text-sm">{row.consultantCode}</span>
      ),
    },
    {
      key: "workordertype",
      name: "Work order type",
      sortable: false,
      render: (row: WorkOrderType) => (
        <span className="p-2 text-sm">{row.type}</span>
      ),
    },
    {
      key: "workorderdescription",
      name: "Work order description",
      sortable: false,
      render: (row: WorkOrderType) => (
        <span className="p-2 text-sm">{row.description}</span>
      ),
    },
    {
      key: "actions",
      name: "actions",
      sortable: false,
      render: (row: WorkOrderType) => (
        <RowActions
          row={row}
          onShow={handleDisplay}
          onEdit={handleEdit}
          canShow={true}
          canEdit={true}
          // t={tTable}  const tTable = useTranslations("Work order type");
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
            Work order types
          </Typography>
        </Box>
        <Button variant="contained" color="primary" sx={{ px: 6 }}>
          Add
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

      <DetailsDialog
        open={openModal}
        setOpenModal={setOpenModal}
        rowId={displayedRowId || editingRowId}
        action={actionType}
      />
    </Box>
  );
}
