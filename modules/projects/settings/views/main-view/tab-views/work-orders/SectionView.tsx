import { Box, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CARDTYPE } from ".";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { RowActions } from "./components/RowActions";
import EditSectionDialog from "./components/dialogs/EditSectionDialog";
import SectionDetailsDialog from "./components/dialogs/SectionDetailsDialog";
import { Section } from "./types";
import AddSectionDialog from "./components/dialogs/AddSectionDialog";

const SectionTable = HeadlessTableLayout<Section>("pssec");

export default function SectionView({
  setActiveCard,
}: {
  setActiveCard: Dispatch<SetStateAction<CARDTYPE>>;
}) {
  const t = useTranslations("section");
  const tTable = useTranslations("section.table");

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

  const params = SectionTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const sections = [
    {
      id: "sec1",
      sectionCode: 100,
      sectionDescription: "قسم الكهرباء الرئيسي",
    },
    {
      id: "sec2",
      sectionCode: 101,
      sectionDescription: "قسم الصيانة",
    },
    {
      id: "sec3",
      sectionCode: 102,
      sectionDescription: "قسم التركيب",
    },
    {
      id: "sec4",
      sectionCode: 103,
      sectionDescription: "قسم الفحص والجودة",
    },
  ];

  const columns = [
    {
      key: "sectionCode",
      name: tTable("code"),
      sortable: false,
      render: (row: Section) => (
        <span className="p-2 text-sm">{row.sectionCode}</span>
      ),
    },
    {
      key: "sectionDescription",
      name: tTable("description"),
      sortable: false,
      render: (row: Section) => (
        <span className="p-2 text-sm">{row.sectionDescription}</span>
      ),
    },
    {
      key: "actions",
      name: tTable("actions"),
      sortable: false,
      render: (row: Section) => (
        <RowActions
          row={row}
          onShow={handleDisplay}
          onEdit={handleEdit}
          canShow={true}
          canEdit={true}
        />
      ),
    },
  ];

  const tableState = SectionTable.useTableState({
    data: sections,
    columns,
    totalPages: 1,
    totalItems: 10,
    params,
    getRowId: (section) => section.id,
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
          {tTable("addSection")}
        </Button>
      </Box>

      <Box
        sx={{
          color: "white",
        }}
      >
        <SectionTable
          table={
            <SectionTable.Table
              state={tableState}
              loadingOptions={{ rows: 5 }}
            ></SectionTable.Table>
          }
        />
      </Box>

      <AddSectionDialog open={openAddDialog} setOpenModal={setOpenAddDialog} />
      <SectionDetailsDialog
        open={openModal}
        setOpenModal={setOpenModal}
        rowId={displayedRowId}
      />
      <EditSectionDialog
        open={editDialogOpen || Boolean(editingRowId)}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingRowId(null);
        }}
        sectionId={editingRowId || undefined}
        onSuccess={() => {
          setEditDialogOpen(false);
          setEditingRowId(null);
        }}
      />
    </Box>
  );
}
