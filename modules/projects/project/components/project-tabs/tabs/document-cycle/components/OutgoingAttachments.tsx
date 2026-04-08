"use client";

import { useMemo, useState } from "react";
import { Box, Button, Stack, TextField, MenuItem } from "@mui/material";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { useOutgoingAttachments } from "@/modules/projects/project/query/useOutgoingAttachments";
import { DocumentRow } from "../types";
import StatusBadge from "./StatusBadge";
import AddFileDialog from "./AddFileDialog";
import OutgoingDetailDialog from "./OutgoingDetailDialog";

const OutgoingTableLayout = HeadlessTableLayout<DocumentRow>("outgoing-docs");

const filterSx = {
  flex: 1,
  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
};

export default function OutgoingAttachments() {
  const t = useTranslations("project.documentCycle");
  const { projectId } = useProject();

  const [addFileOpen, setAddFileOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentRow | null>(null);

  const [filterDocType, setFilterDocType] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const params = OutgoingTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const { data: queryResult, isLoading } = useOutgoingAttachments({
    projectId,
    page: params.page,
    perPage: params.limit,
    documentType: filterDocType || undefined,
    type: filterType || undefined,
    endDate: filterEndDate || undefined,
  });

  const data = useMemo(() => queryResult?.data ?? [], [queryResult]);
  const totalPages = queryResult?.totalPages ?? 1;
  const totalItems = queryResult?.totalItems ?? 0;

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
      {
        key: "actions",
        name: t("actions"),
        sortable: false,
        render: (row: DocumentRow) => (
          <CustomMenu
            renderAnchor={({ onClick }) => (
              <Button size="small" variant="contained" color="info" onClick={onClick}>
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
    [t],
  );

  const state = OutgoingTableLayout.useTableState({
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

  return (
    <>
      <Box>
        <OutgoingTableLayout
          filters={
            <Stack spacing={2}>
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

              <OutgoingTableLayout.TopActions
                state={state}
                customActions={
                  <Button variant="contained" onClick={() => setAddFileOpen(true)}>
                    {t("addFile")}
                  </Button>
                }
              />
            </Stack>
          }
          table={
            <OutgoingTableLayout.Table state={state} loadingOptions={{ rows: 5 }} />
          }
          pagination={<OutgoingTableLayout.Pagination state={state} />}
        />
      </Box>

      <AddFileDialog open={addFileOpen} onClose={() => setAddFileOpen(false)} />

      <OutgoingDetailDialog
        open={detailDialogOpen}
        onClose={handleCloseDetail}
        document={selectedDocument}
      />
    </>
  );
}
