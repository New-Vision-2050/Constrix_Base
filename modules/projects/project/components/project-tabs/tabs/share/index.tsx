"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert, Box, Button, MenuItem, Stack, Typography } from "@mui/material";
import { ArrowDownUp, EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { ProjectSharingApi } from "@/services/api/projects/project-sharing";
import type { ProjectShareAssignment } from "@/services/api/projects/project-sharing/types/response";
import type { ProjectShareRow } from "./types";
import ShareProjectDialog from "./components/ShareProjectDialog";
import ShareStatsWidgets from "./components/ShareStatsWidgets";
import { countShareAssignmentSegments } from "./share-status-segments";

function mapAssignmentToRow(a: ProjectShareAssignment): ProjectShareRow {
  const company = a.shared_with_company;
  return {
    id: a.id,
    companyName: company?.name ?? "",
    email: company?.email ?? a.user?.email ?? "",
    mobile: company?.phone ?? "",
    representative: a.shared_by?.name ?? a.assigned_by?.name ?? "",
    sentAt: a.created_at ?? a.assigned_at ?? "",
    status: (a.status ?? "").trim(),
  };
}

/** Calendar date like `2026/04/08` for the sent-date column. */
function formatSentDate(iso: string): string {
  if (!iso.trim()) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

function shareStatusLabel(
  status: string,
  t: (key: string) => string,
  empty: string,
): string {
  const key = status.trim().toLowerCase();
  switch (key) {
    case "pending":
      return t("statusPending");
    case "sent":
      return t("statusSent");
    case "draft":
    case "under_construction":
      return t("statusDraft");
    case "accepted":
    case "approved":
      return t("statusAccepted");
    case "rejected":
      return t("statusRejected");
    default:
      return status || empty;
  }
}

function shareStatusColor(status: string): string {
  const key = status.trim().toLowerCase();
  switch (key) {
    case "sent":
      return "primary.main";
    case "pending":
      return "warning.main";
    case "draft":
    case "under_construction":
      return "warning.main";
    case "accepted":
    case "approved":
      return "success.main";
    case "rejected":
      return "error.main";
    default:
      return "text.secondary";
  }
}

function compareShareRows(
  a: ProjectShareRow,
  b: ProjectShareRow,
  sortKey: string,
  direction: "asc" | "desc",
): number {
  const dir = direction === "desc" ? -1 : 1;
  if (sortKey === "sentAt") {
    const ta = new Date(a.sentAt).getTime();
    const tb = new Date(b.sentAt).getTime();
    const na = Number.isNaN(ta) ? 0 : ta;
    const nb = Number.isNaN(tb) ? 0 : tb;
    return (na - nb) * dir;
  }
  const av = String(a[sortKey as keyof ProjectShareRow] ?? "");
  const bv = String(b[sortKey as keyof ProjectShareRow] ?? "");
  return av.localeCompare(bv, undefined, { numeric: true }) * dir;
}

const ShareTableLayout = HeadlessTableLayout<ProjectShareRow>("project-share");

export default function ShareTab() {
  const t = useTranslations("project.share");
  const tProject = useTranslations("project");
  const { projectId } = useProject();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const params = ShareTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
    initialSortBy: "companyName",
  });

  const sharesQuery = useQuery({
    queryKey: ["project-shares", projectId],
    queryFn: async () => {
      const res = await ProjectSharingApi.listForProject(projectId);
      return res.data?.payload ?? [];
    },
    enabled: !!projectId,
  });

  const allRows = useMemo(
    () => (sharesQuery.data ?? []).map(mapAssignmentToRow),
    [sharesQuery.data],
  );

  const segmentCounts = useMemo(
    () => countShareAssignmentSegments(allRows),
    [allRows],
  );

  const searchFiltered = useMemo(() => {
    const q = params.search.trim().toLowerCase();
    if (!q) return allRows;
    return allRows.filter((row) =>
      [
        row.companyName,
        row.email,
        row.mobile,
        row.representative,
        row.status,
        shareStatusLabel(row.status, t, ""),
        formatSentDate(row.sentAt),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [allRows, params.search, t]);

  const sortedRows = useMemo(() => {
    const key = params.sortBy ?? "companyName";
    if (key === "actions") return searchFiltered;
    const direction = (params.sortDirection ?? "asc") as "asc" | "desc";
    return [...searchFiltered].sort((a, b) =>
      compareShareRows(a, b, key, direction),
    );
  }, [searchFiltered, params.sortBy, params.sortDirection]);

  const pageData = useMemo(() => {
    const start = (params.page - 1) * params.limit;
    return sortedRows.slice(start, start + params.limit);
  }, [sortedRows, params.page, params.limit]);

  const totalItems = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / params.limit));

  const columns = useMemo(
    () => [
      {
        key: "companyName",
        name: t("companyName"),
        sortable: true,
        render: (row: ProjectShareRow) => (
          <span>
            {row.companyName.trim() ? row.companyName : tProject("emptyCell")}
          </span>
        ),
      },
      {
        key: "email",
        name: t("email"),
        sortable: true,
        render: (row: ProjectShareRow) => (
          <span>{row.email.trim() ? row.email : tProject("emptyCell")}</span>
        ),
      },
      {
        key: "mobile",
        name: t("mobile"),
        sortable: true,
        render: (row: ProjectShareRow) => (
          <span>{row.mobile.trim() ? row.mobile : tProject("emptyCell")}</span>
        ),
      },
      {
        key: "representative",
        name: t("companyRepresentative"),
        sortable: true,
        render: (row: ProjectShareRow) => (
          <span>
            {row.representative.trim()
              ? row.representative
              : tProject("emptyCell")}
          </span>
        ),
      },
      {
        key: "sentAt",
        name: t("sentDate"),
        sortable: true,
        render: (row: ProjectShareRow) => {
          const formatted = formatSentDate(row.sentAt);
          return (
            <span>
              {formatted.trim() ? formatted : tProject("emptyCell")}
            </span>
          );
        },
      },
      {
        key: "status",
        name: t("requestStatus"),
        sortable: true,
        render: (row: ProjectShareRow) => {
          const label = shareStatusLabel(
            row.status,
            t,
            tProject("emptyCell"),
          );
          return (
            <Typography
              component="span"
              variant="body2"
              sx={{
                color: shareStatusColor(row.status),
                fontWeight: 600,
              }}
            >
              {label}
            </Typography>
          );
        },
      },
      {
        key: "actions",
        name: t("columnActions"),
        sortable: false,
        render: () => (
          <CustomMenu
            renderAnchor={({ onClick }) => (
              <Button
                size="small"
                variant="contained"
                color="info"
                onClick={onClick}
              >
                {t("actionMenu")}
              </Button>
            )}
          >
            <MenuItem onClick={() => {}}>
              <EditIcon className="w-4 h-4 ml-2" />
              {t("edit")}
            </MenuItem>
          </CustomMenu>
        ),
      },
    ],
    [t, tProject],
  );

  const state = ShareTableLayout.useTableState({
    data: pageData,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: ProjectShareRow) => row.id,
    loading: sharesQuery.isLoading,
    searchable: true,
    filtered: params.search.trim().length > 0,
    onExport: async () => {
      // TODO: export selected rows
    },
  });

  const widgetLabels = useMemo(
    () => ({
      awaiting: t("widgetAwaiting"),
      rejected: t("widgetRejected"),
      accepted: t("widgetAccepted"),
      inProgress: t("widgetInProgress"),
      total: t("widgetTotal"),
    }),
    [t],
  );

  return (
    <Box sx={{ p: 3 }}>
      {sharesQuery.isError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("loadSharesError")}
        </Alert>
      ) : null}

      <ShareStatsWidgets counts={segmentCounts} labels={widgetLabels} />

      <ShareTableLayout
        filters={
          <ShareTableLayout.TopActions
            state={state}
            searchComponent={
              state.table.searchable ? (
                <ShareTableLayout.Search
                  search={state.search}
                  placeholder={t("searchTypePlaceholder")}
                />
              ) : undefined
            }
            customActions={
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  variant="outlined"
                  color="info"
                  startIcon={<ArrowDownUp className="h-4 w-4" />}
                  onClick={() => params.handleSort("companyName")}
                >
                  {t("sort")}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setShareDialogOpen(true)}
                >
                  {t("inviteCompany")}
                </Button>
              </Stack>
            }
          />
        }
        table={
          <ShareTableLayout.Table
            state={state}
            loadingOptions={{ rows: 5 }}
          />
        }
        pagination={<ShareTableLayout.Pagination state={state} />}
      />
      <ShareProjectDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
      />
    </Box>
  );
}
