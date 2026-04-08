"use client";

import { useMemo, useState } from "react";
import { Box, Button, Stack, TextField, MenuItem } from "@mui/material";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import { DocumentRow } from "../types";
import { MOCK_INCOMING_DOCUMENTS } from "../constants/mock-data";
import StatusBadge from "./StatusBadge";
import AttachmentDetailDialog from "./AttachmentDetailDialog";

const IncomingTableLayout = HeadlessTableLayout<DocumentRow>("incoming-docs");

export default function IncomingAttachments() {
  const t = useTranslations("project.documentCycle");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentRow | null>(null);
  const [filterDocType, setFilterDocType] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const handleView = (row: DocumentRow) => {
    setSelectedDocument(row);
    setDetailDialogOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailDialogOpen(false);
    setSelectedDocument(null);
  };

  const baseColumns = useMemo(
    () => [
      {
        key: "name",
        name: t("documentName"),
        sortable: false,
        render: (row: DocumentRow) => <span>{row.name}</span>,
      },
      {
        key: "fileSize",
        name: t("fileSize"),
        sortable: false,
        render: (row: DocumentRow) => <span>{row.fileSize}</span>,
      },
      {
        key: "documentCount",
        name: t("documentCount"),
        sortable: false,
        render: (row: DocumentRow) => <span>{row.documentCount}</span>,
      },
      {
        key: "lastActivity",
        name: t("lastActivity"),
        sortable: false,
        render: (row: DocumentRow) => (
          <span>
            {t("byUser")} {row.lastActivityUser}
          </span>
        ),
      },
      {
        key: "status",
        name: t("status"),
        sortable: false,
        render: (row: DocumentRow) => <StatusBadge status={row.status} />,
      },
    ],
    [t],
  );

  const params = IncomingTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const data = useMemo(() => MOCK_INCOMING_DOCUMENTS, []);
  const totalPages = 3;
  const totalItems = 13;

  const columns = useMemo(
    () => [
      ...baseColumns,
      {
        key: "actions",
        name: t("actions"),
        sortable: false,
        render: (row: DocumentRow) => (
          <CustomMenu
            renderAnchor={({ onClick }) => (
              <Button
                size="small"
                variant="contained"
                color="info"
                onClick={onClick}
              >
                {t("action")}
              </Button>
            )}
          >
            <Button
              size="small"
              sx={{ width: "100%", justifyContent: "flex-start", px: 2 }}
              onClick={() => handleView(row)}
            >
              {t("view")}
            </Button>
          </CustomMenu>
        ),
      },
    ],
    [baseColumns, t],
  );

  const state = IncomingTableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: DocumentRow) => row.id,
    loading: false,
    searchable: true,
    onExport: async () => {},
  });

  const filterSx = {
    flex: 1,
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
    },
  };

  return (
    <>
      <Box>
        <IncomingTableLayout
          filters={
            <Stack spacing={2}>
              {/* Filter row */}
              <Stack direction="row" spacing={2}>
                <TextField
                  select
                  size="small"
                  label={t("documentType")}
                  value={filterDocType}
                  onChange={(e) => { setFilterDocType(e.target.value); params.setPage(1); }}
                  sx={filterSx}
                >
                  <MenuItem value="">{t("all")}</MenuItem>
                  <MenuItem value="review">{t("type")}</MenuItem>
                </TextField>

                <TextField
                  select
                  size="small"
                  label={t("type")}
                  value={filterType}
                  onChange={(e) => { setFilterType(e.target.value); params.setPage(1); }}
                  sx={filterSx}
                >
                  <MenuItem value="">{t("all")}</MenuItem>
                  <MenuItem value="draft">{t("draft")}</MenuItem>
                  <MenuItem value="approved">{t("approved")}</MenuItem>
                  <MenuItem value="rejected">{t("rejected")}</MenuItem>
                </TextField>

                <TextField
                  size="small"
                  label={t("endDate")}
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => { setFilterEndDate(e.target.value); params.setPage(1); }}
                  InputLabelProps={{ shrink: true }}
                  sx={filterSx}
                />
              </Stack>

              {/* TopActions bar */}
              <IncomingTableLayout.TopActions state={state} />
            </Stack>
          }
          table={
            <IncomingTableLayout.Table
              state={state}
              loadingOptions={{ rows: 5 }}
            />
          }
          pagination={<IncomingTableLayout.Pagination state={state} />}
        />
      </Box>

      <AttachmentDetailDialog
        open={detailDialogOpen}
        onClose={handleCloseDetail}
        document={selectedDocument}
      />
    </>
  );
}
