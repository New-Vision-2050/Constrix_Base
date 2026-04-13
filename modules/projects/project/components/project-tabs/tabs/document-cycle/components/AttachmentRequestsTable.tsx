"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Button, Stack, TextField, MenuItem } from "@mui/material";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { useAttachmentRequests } from "@/modules/projects/project/query/useAttachmentRequests";
import { DocumentRow } from "../types";
import StatusBadge from "./StatusBadge";
import AddFileDialog from "./AddFileDialog";
import AttachmentRequestDetailDialog from "./AttachmentRequestDetailDialog";
import { EyeIcon } from "lucide-react";

const TableLayout = HeadlessTableLayout<DocumentRow>("attachment-requests-table");

const filterSx = {
  flex: 1,
  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
} as const;

function RequestFlowCell({ row, t }: { row: DocumentRow; t: (key: string) => string }) {
  if (row.status === "draft") {
    return (
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          px: 1.5,
          py: 0.5,
          borderRadius: "6px",
          bgcolor: "warning.main",
          color: "warning.contrastText",
          fontWeight: 600,
          fontSize: "0.8rem",
          minWidth: 50,
        }}
      >
        {t("draft")}
      </Box>
    );
  }
  const incoming = row.flow === "incoming";
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        px: 1.5,
        py: 0.5,
        borderRadius: "6px",
        bgcolor: incoming ? "#1E40AF" : "success.main",
        color: "#fff",
        fontWeight: 600,
        fontSize: "0.8rem",
        minWidth: 50,
      }}
    >
      {incoming ? t("requestTypeIncoming") : t("requestTypeOutgoing")}
    </Box>
  );
}

export default function AttachmentRequestsTable() {
  const t = useTranslations("project.documentCycle");
  const { projectId } = useProject();

  const [addFileOpen, setAddFileOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentRow | null>(
    null,
  );

  const [filterDocType, setFilterDocType] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterDirection, setFilterDirection] = useState<
    "" | "incoming" | "outgoing"
  >("");

  const params = TableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const { data: queryResult, isLoading } = useAttachmentRequests({
    projectId,
    page: params.page,
    perPage: params.limit,
    documentType: filterDocType || undefined,
    type: filterType || undefined,
    endDate: filterEndDate || undefined,
    direction: filterDirection,
  });

  const data = useMemo(() => queryResult?.data ?? [], [queryResult]);
  const totalPages = queryResult?.totalPages ?? 1;
  const totalItems = queryResult?.totalItems ?? 0;

  useEffect(() => {
    if (!selectedDocument) return;
    const row = data.find((r) => r.id === selectedDocument.id);
    if (row) setSelectedDocument(row);
  }, [data, selectedDocument?.id]);

  const handleView = (row: DocumentRow) => {
    setSelectedDocument(row);
    setDetailDialogOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailDialogOpen(false);
    setSelectedDocument(null);
  };

  const columns = useMemo(
    () => [
      {
        key: "requestFlow",
        name: t("requestFlowColumn"),
        sortable: false,
        render: (row: DocumentRow) => (
          <RequestFlowCell row={row} t={t} />
        ),
      },
      {
        key: "serialNumber",
        name: t("serialNumber"),
        sortable: false,
        render: (row: DocumentRow) => (
          <span>{row.serialNumber || row.id}</span>
        ),
      },
      {
        key: "sender",
        name: t("sender"),
        sortable: false,
        render: (row: DocumentRow) => (
          <span>{row.senderName?.trim() || "—"}</span>
        ),
      },
      {
        key: "receiver",
        name: t("counterpartyColumn"),
        sortable: false,
        render: (row: DocumentRow) => (
          <span>{row.receiverName?.trim() || "—"}</span>
        ),
      },
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
        render: (row: DocumentRow) => {
          const dateStr = row.lastActivityDate?.trim();
          return <span>{dateStr || "—"}</span>;
        },
      },
      {
        key: "status",
        name: t("status"),
        sortable: false,
        render: (row: DocumentRow) => <StatusBadge status={row.status} />,
      },
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
              <EyeIcon className="h-4 w-4 ms-2" />
            </Button>
          </CustomMenu>
        ),
      },
    ],
    [t],
  );

  const state = TableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: DocumentRow) => row.id,
    loading: isLoading,
    searchable: true,
    onExport: async () => {},
  });

  const detailVariant =
    selectedDocument?.flow === "incoming" ? "incoming" : "outgoing";

  return (
    <>
      <Box>
        <TableLayout
          filters={
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <TextField
                  select
                  size="small"
                  label={t("documentType")}
                  value={filterDocType}
                  onChange={(e) => {
                    setFilterDocType(e.target.value);
                    params.setPage(1);
                  }}
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
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    params.setPage(1);
                  }}
                  sx={filterSx}
                >
                  <MenuItem value="">{t("all")}</MenuItem>
                  <MenuItem value="draft">{t("draft")}</MenuItem>
                  <MenuItem value="approved">{t("approved")}</MenuItem>
                  <MenuItem value="rejected">{t("rejected")}</MenuItem>
                </TextField>

                <TextField
                  select
                  size="small"
                  label={t("requestDirectionFilter")}
                  value={filterDirection}
                  onChange={(e) => {
                    setFilterDirection(
                      e.target.value as "" | "incoming" | "outgoing",
                    );
                    params.setPage(1);
                  }}
                  sx={filterSx}
                >
                  <MenuItem value="">{t("all")}</MenuItem>
                  <MenuItem value="outgoing">{t("requestTypeOutgoing")}</MenuItem>
                  <MenuItem value="incoming">{t("requestTypeIncoming")}</MenuItem>
                </TextField>

                <TextField
                  size="small"
                  label={t("endDate")}
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => {
                    setFilterEndDate(e.target.value);
                    params.setPage(1);
                  }}
                  InputLabelProps={{ shrink: true }}
                  sx={filterSx}
                />
              </Stack>

              <TableLayout.TopActions
                state={state}
                customActions={
                  <Button
                    variant="contained"
                    onClick={() => setAddFileOpen(true)}
                  >
                    {t("addFile")}
                  </Button>
                }
              />
            </Stack>
          }
          table={
            <TableLayout.Table
              state={state}
              loadingOptions={{ rows: 5 }}
            />
          }
          pagination={<TableLayout.Pagination state={state} />}
        />
      </Box>

      <AddFileDialog open={addFileOpen} onClose={() => setAddFileOpen(false)} />

      <AttachmentRequestDetailDialog
        open={detailDialogOpen}
        onClose={handleCloseDetail}
        document={selectedDocument}
        variant={detailVariant}
      />
    </>
  );
}
