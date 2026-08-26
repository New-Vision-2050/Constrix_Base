"use client";

import { useEffect, useMemo, useState, useDeferredValue } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import { useOptionalProject } from "@/modules/all-project/context/ProjectContext";
import { useOptionalContractualEngagement } from "@/modules/projects/project/context/ContractualEngagementContext";
import { useAttachmentRequests } from "@/modules/projects/project/query/useAttachmentRequests";
import { useProjectMyPermissionsFlat } from "@/modules/projects/project/query/useProjectMyPermissionsFlat";
import { InternalProcedureSettingsApi } from "@/services/api/hr-settings/internal-procedure-settings";
import { baseApi } from "@/config/axios/instances/base";
import {
  PROJECT_ARCHIVE_CYCLE_CREATE,
  PROJECT_ARCHIVE_CYCLE_LIST,
  PROJECT_ARCHIVE_CYCLE_VIEW,
} from "@/modules/projects/project/constants/projectPermissionKeys";
import {
  hasAnyProjectPermissionKey,
  hasProjectPermissionKey,
} from "@/modules/projects/project/utils/projectMyPermissions";
import { DocumentRow } from "../types";
import StatusBadge from "./StatusBadge";
import AddFileDialog from "./AddFileDialog";
import AttachmentRequestDetailDialog from "./AttachmentRequestDetailDialog";
import { EyeIcon } from "lucide-react";

const DOCUMENT_TYPE_PROCEDURE = "project_procedure";

type CompanyOption = { id: string; name: string };const TableLayout = HeadlessTableLayout<DocumentRow>(
  "attachment-requests-table",
);

const filterSx = {
  flex: 1,
  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
} as const;

function RequestFlowCell({
  row,
  t,
}: {
  row: DocumentRow;
  t: (key: string) => string;
}) {
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
        bgcolor: incoming ? "primary.main" : "success.main",
        color: incoming ? "primary.contrastText" : "success.contrastText",
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
  const tCommon = useTranslations("common");
  const engagement = useOptionalContractualEngagement();
  const project = useOptionalProject();
  const projectId = project?.projectId;

  const { data: flatPerms, isLoading: isLoadingPerms } =
    useProjectMyPermissionsFlat(projectId);

  const canViewCycle = useMemo(
    () =>
      engagement
        ? true
        : hasAnyProjectPermissionKey(flatPerms, [
            PROJECT_ARCHIVE_CYCLE_VIEW,
            PROJECT_ARCHIVE_CYCLE_LIST,
          ]),
    [engagement, flatPerms],
  );
  const canCreateCycle = useMemo(
    () =>
      !engagement &&
      hasProjectPermissionKey(flatPerms, PROJECT_ARCHIVE_CYCLE_CREATE),
    [engagement, flatPerms],
  );
  const canOpenDetail = useMemo(
    () =>
      engagement
        ? true
        : hasAnyProjectPermissionKey(flatPerms, [
            PROJECT_ARCHIVE_CYCLE_VIEW,
            PROJECT_ARCHIVE_CYCLE_LIST,
          ]),
    [engagement, flatPerms],
  );

  // Companies API for الجهة filter → receiver_company_ids[]
  const [companySearch, setCompanySearch] = useState("");
  const deferredCompanySearch = useDeferredValue(companySearch);
  const { data: companies = [], isFetching: loadingCompanies } = useQuery({
    queryKey: ["companies", "attachment-requests-filter", deferredCompanySearch],
    queryFn: async (): Promise<CompanyOption[]> => {
      const res = await baseApi.get("companies", {
        params: {
          per_page: 50,
          ...(deferredCompanySearch.trim()
            ? { name: deferredCompanySearch.trim() }
            : {}),
        },
      });
      const raw =
        res.data?.payload ?? res.data?.data ?? res.data?.companies ?? [];
      const list = Array.isArray(raw) ? raw : [];
      return list
        .map((item: { id?: string | number; name?: string }) => ({
          id: String(item.id ?? ""),
          name: String(item.name ?? "").trim(),
        }))
        .filter((c: CompanyOption) => c.id && c.name);
    },
  });

  // Document types (نوع الوثيقة) — same source as AddFileDialog
  const { data: documentTypes = [], isLoading: loadingDocumentTypes } =
    useQuery({
      queryKey: ["internal-procedures", DOCUMENT_TYPE_PROCEDURE, projectId],
      queryFn: async () => {
        if (!projectId) return [];
        return InternalProcedureSettingsApi.getInternalProcedures(
          DOCUMENT_TYPE_PROCEDURE,
          { projectId },
        );
      },
      enabled: !!projectId,
    });

  const [addFileOpen, setAddFileOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentRow | null>(
    null,
  );

  const [filterType, setFilterType] = useState("");
  const [filterProcedureSettingId, setFilterProcedureSettingId] = useState("");
  const [filterReceiverCompany, setFilterReceiverCompany] =
    useState<CompanyOption | null>(null);

  const params = TableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const { data: queryResult, isLoading } = useAttachmentRequests({
    projectId,
    contractualEngagementKey: engagement?.contractualEngagementKey,
    page: params.page,
    perPage: params.limit,
    type: filterType || undefined,
    procedureSettingId: filterProcedureSettingId || undefined,
    receiverCompanyIds: filterReceiverCompany?.id
      ? [filterReceiverCompany.id]
      : undefined,
    name: params.search || undefined,
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
        render: (row: DocumentRow) => <RequestFlowCell row={row} t={t} />,
      },
      {
        key: "serialNumber",
        name: t("serialNumber"),
        sortable: false,
        render: (row: DocumentRow) => <span>{row.serialNumber || row.id}</span>,
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
        key: "name",
        name: t("documentName"),
        sortable: false,
        render: (row: DocumentRow) => <span>{row.name}</span>,
      },
      {
        key: "documentType",
        name: t("documentType"),
        sortable: false,
        render: (row: DocumentRow) => (
          <span>{row.documentType?.trim() || "—"}</span>
        ),
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
                color="primary"
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
              disabled={!canOpenDetail}
            >
              {t("view")}
              <EyeIcon className="h-4 w-4 ms-2" />
            </Button>
          </CustomMenu>
        ),
      },
    ],
    [t, canOpenDetail],
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

  if (!engagement && !projectId) {
    return null;
  }

  if (!engagement && isLoadingPerms) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (!canViewCycle) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">{tCommon("noProjectTabPermission")}</Alert>
      </Box>
    );
  }

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
                  value={filterProcedureSettingId}
                  onChange={(e) => {
                    setFilterProcedureSettingId(e.target.value);
                    params.setPage(1);
                  }}
                  disabled={loadingDocumentTypes}
                  sx={filterSx}
                >
                  <MenuItem value="">{t("all")}</MenuItem>
                  {documentTypes.map((type) => (
                    <MenuItem key={type.id} value={String(type.id)}>
                      {type.name}
                    </MenuItem>
                  ))}
                </TextField>

                <Autocomplete
                  size="small"
                  options={companies}
                  loading={loadingCompanies}
                  value={filterReceiverCompany}
                  onChange={(_, value) => {
                    setFilterReceiverCompany(value);
                    params.setPage(1);
                  }}
                  onInputChange={(_, value, reason) => {
                    if (reason === "input") setCompanySearch(value);
                    if (reason === "clear") setCompanySearch("");
                  }}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(a, b) => a.id === b.id}
                  filterOptions={(x) => x}
                  sx={filterSx}
                  renderInput={(inputParams) => (
                    <TextField
                      {...inputParams}
                      label={t("counterpartyColumn")}
                      placeholder={t("all")}
                      InputProps={{
                        ...inputParams.InputProps,
                        endAdornment: (
                          <>
                            {loadingCompanies ? (
                              <CircularProgress color="inherit" size={16} />
                            ) : null}
                            {inputParams.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />

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
                  <MenuItem value="pending">{t("pending")}</MenuItem>
                  <MenuItem value="approved">{t("approved")}</MenuItem>
                  <MenuItem value="declined">{t("declined")}</MenuItem>
                  <MenuItem value="semi-approved">
                    {t("partiallyApproved")}
                  </MenuItem>
                </TextField>
              </Stack>

              <TableLayout.TopActions
                state={state}
                customActions={
                  canCreateCycle ? (
                    <Button
                      variant="contained"
                      onClick={() => setAddFileOpen(true)}
                    >
                      {t("addFile")}
                    </Button>
                  ) : undefined
                }
              />
            </Stack>
          }
          table={
            <TableLayout.Table state={state} loadingOptions={{ rows: 5 }} />
          }
          pagination={<TableLayout.Pagination state={state} />}
        />
      </Box>

      {!engagement && (
        <AddFileDialog open={addFileOpen} onClose={() => setAddFileOpen(false)} />
      )}

      <AttachmentRequestDetailDialog
        open={detailDialogOpen}
        onClose={handleCloseDetail}
        document={selectedDocument}
        variant={detailVariant}
      />
    </>
  );
}
