import { Box, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CARDTYPE } from ".";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { RowActions } from "./components/RowActions";
import EditActionsDialog from "./components/dialogs/EditActionsDialog";
import ActionsDetailsDialog from "./components/dialogs/ActionsDetailsDialog";
import { Action } from "./types";
import AddActionsDialog from "./components/dialogs/AddActionsDialog";

const ActionsTable = HeadlessTableLayout<Action>("psact");

export default function ActionsView({
  setActiveCard,
}: {
  setActiveCard: Dispatch<SetStateAction<CARDTYPE>>;
}) {
  const t = useTranslations("projectSettings.actions");
  const tTable = useTranslations("projectSettings.actions.table");

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

  const params = ActionsTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const actions = [
    { id: "act1", code: 200, description: "إجراء أول" },
    { id: "act2", code: 201, description: "إجراء ثاني" },
    { id: "act3", code: 202, description: "إجراء ثالث" },
    { id: "act4", code: 203, description: "إجراء رابع" },
  ];

  const columns = [
    {
      key: "code",
      name: tTable("code"),
      sortable: false,
      render: (row: Action) => (
        <span className="p-2 text-sm">{row.code}</span>
      ),
    },
    {
      key: "description",
      name: tTable("description"),
      sortable: false,
      render: (row: Action) => (
        <span className="p-2 text-sm">{row.description}</span>
      ),
    },
    {
      key: "actions",
      name: tTable("actions"),
      sortable: false,
      render: (row: Action) => (
        <RowActions
          row={row}
          onShow={handleDisplay}
          onEdit={handleEdit}
          canShow={true}
          canEdit={true}
          translationNamespace="projectSettings.actions.table"
          editLabelKey="editAction"
        />
      ),
    },
  ];

  const tableState = ActionsTable.useTableState({
    data: actions,
    columns,
    totalPages: 1,
    totalItems: 10,
    params,
    getRowId: (action) => action.id,
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
          <IconButton onClick={() => setActiveCard("HIDE")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">{t("title")}</Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ px: 6 }}
          onClick={handleAdd}
        >
          {tTable("addAction")}
        </Button>
      </Box>

      <Box>
        <ActionsTable
          table={
            <ActionsTable.Table
              state={tableState}
              loadingOptions={{ rows: 5 }}
            />
          }
        />
      </Box>

      <AddActionsDialog open={openAddDialog} setOpenModal={setOpenAddDialog} />
      <ActionsDetailsDialog
        open={openModal}
        setOpenModal={setOpenModal}
        rowId={displayedRowId}
      />
      <EditActionsDialog
        open={editDialogOpen || Boolean(editingRowId)}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingRowId(null);
        }}
        actionId={editingRowId || undefined}
      />
    </Box>
  );
}
