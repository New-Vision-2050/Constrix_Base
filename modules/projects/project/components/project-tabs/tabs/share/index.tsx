"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Alert, Box, Button, MenuItem, Stack, Typography } from "@mui/material";
import { ArrowDownUp, EditIcon } from "lucide-react";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { ProjectSharingApi } from "@/services/api/projects/project-sharing";
import type { ProjectShareAssignment } from "@/services/api/projects/project-sharing/types/response";
import type { ProjectShareEntityRef, ProjectShareRow } from "./types";
import ShareProjectDialog from "./components/ShareProjectDialog";
import ShareStatsWidgets from "./components/ShareStatsWidgets";
import { countShareAssignmentSegments } from "./share-status-segments";

function toEntityRef(
  c: { id: string; name: string; serial_number?: string | null } | null | undefined,
): ProjectShareEntityRef | null {
  if (!c) return null;
  return {
    id: c.id,
    name: c.name,
    serial_number: c.serial_number ?? null,
  };
}

function mapAssignmentToRow(a: ProjectShareAssignment): ProjectShareRow {
  const withCo = a.shared_with_company;
  return {
    id: a.id,
    created_at: a.created_at ?? a.assigned_at ?? "",
    updated_at: a.updated_at ?? "",
    notes: a.notes ?? null,
    owner_company: toEntityRef(a.owner_company),
    relation: a.relation ?? null,
    responded_at: a.responded_at ?? null,
    responded_by: a.responded_by ?? null,
    role: a.role ?? null,
    schema_ids: a.schema_ids ?? [],
    shareable: a.shareable ? toEntityRef(a.shareable) : null,
    shareable_id: a.shareable_id ?? "",
    shareable_type: a.shareable_type ?? "",
    shared_by: a.shared_by ?? null,
    shared_with_company: withCo
      ? {
          ...toEntityRef(withCo)!,
          email: withCo.email ?? a.user?.email,
          phone: withCo.phone,
        }
      : null,
    status: (a.status ?? "").trim(),
    type: a.type ?? null,
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

function resolveShareStatusLabel(
  status: string,
  tStatus: (key: string) => string,
  emptyDash: string,
): string {
  const key = status.trim().toLowerCase();
  switch (key) {
    case "pending":
      return tStatus("pending");
    case "sent":
      return tStatus("sent");
    case "draft":
      return tStatus("draft");
    case "under_construction":
      return tStatus("under_construction");
    case "accepted":
    case "approved":
      return tStatus("accepted");
    case "rejected":
      return tStatus("rejected");
    default:
      return status.trim() ? status : emptyDash;
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

function sortStringForRow(row: ProjectShareRow, sortKey: string): string {
  switch (sortKey) {
    case "shared_with_company":
      return row.shared_with_company?.name ?? "";
    case "owner_company":
      return row.owner_company?.name ?? "";
    case "shareable":
      return row.shareable?.name ?? "";
    case "shared_by":
      return row.shared_by?.name ?? "";
    case "responded_by":
      return row.responded_by?.name ?? "";
    case "email":
      return row.shared_with_company?.email ?? "";
    case "mobile":
      return row.shared_with_company?.phone ?? "";
    case "schema_ids":
      return row.schema_ids.join(",");
    default: {
      const v = row[sortKey as keyof ProjectShareRow];
      if (v == null) return "";
      if (
        typeof v === "string" ||
        typeof v === "number" ||
        typeof v === "boolean"
      ) {
        return String(v);
      }
      return "";
    }
  }
}

function compareShareRows(
  a: ProjectShareRow,
  b: ProjectShareRow,
  sortKey: string,
  direction: "asc" | "desc",
): number {
  const dir = direction === "desc" ? -1 : 1;
  if (
    sortKey === "created_at" ||
    sortKey === "updated_at" ||
    sortKey === "responded_at"
  ) {
    const key = sortKey as "created_at" | "updated_at" | "responded_at";
    const ta = new Date(
      key === "responded_at" ? (a.responded_at ?? "") : a[key],
    ).getTime();
    const tb = new Date(
      key === "responded_at" ? (b.responded_at ?? "") : b[key],
    ).getTime();
    const na = Number.isNaN(ta) ? 0 : ta;
    const nb = Number.isNaN(tb) ? 0 : tb;
    return (na - nb) * dir;
  }
  const av = sortStringForRow(a, sortKey);
  const bv = sortStringForRow(b, sortKey);
  return av.localeCompare(bv, undefined, { numeric: true }) * dir;
}

const ShareTableLayout = HeadlessTableLayout<ProjectShareRow>("project-share");

export default function ShareTab() {
  const { projectId } = useProject();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const t = useTranslations("project.shareTab");
  const tTable = useTranslations("project.shareTab.table");
  const tStatus = useTranslations("project.shareTab.status");
  const tWidgets = useTranslations("project.shareTab.widgets");

  const params = ShareTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
    initialSortBy: "shared_with_company",
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

  const emptyDash = t("emptyDash");

  const searchFiltered = useMemo(() => {
    const q = params.search.trim().toLowerCase();
    if (!q) return allRows;
    return allRows.filter((row) =>
      [
        row.shared_with_company?.name,
        row.shared_with_company?.email,
        row.shared_with_company?.phone,
        row.shared_by?.name,
        row.type,
        row.relation,
        row.role,
        row.status,
        resolveShareStatusLabel(row.status, tStatus, emptyDash),
        formatSentDate(row.created_at),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [allRows, params.search, tStatus, emptyDash]);

  const sortedRows = useMemo(() => {
    const key = params.sortBy ?? "shared_with_company";
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
        key: "shared_with_company",
        name: tTable("companyName"),
        sortable: true,
        render: (row: ProjectShareRow) => {
          const name = row.shared_with_company?.name?.trim() ?? "";
          return <span>{name ? name : emptyDash}</span>;
        },
      },
      {
        key: "type",
        name: tTable("type"),
        sortable: true,
        render: (row: ProjectShareRow) => (
          <span>{row.type?.trim() ? row.type : emptyDash}</span>
        ),
      },
      {
        key: "relation",
        name: tTable("relation"),
        sortable: true,
        render: (row: ProjectShareRow) => (
          <span>{row.relation?.trim() ? row.relation : emptyDash}</span>
        ),
      },
      {
        key: "role",
        name: tTable("role"),
        sortable: true,
        render: (row: ProjectShareRow) => (
          <span>{row.role?.trim() ? row.role : emptyDash}</span>
        ),
      },
      {
        key: "email",
        name: tTable("email"),
        sortable: true,
        render: (row: ProjectShareRow) => {
          const email = row.shared_with_company?.email?.trim() ?? "";
          return <span>{email ? email : emptyDash}</span>;
        },
      },
      {
        key: "mobile",
        name: tTable("mobile"),
        sortable: true,
        render: (row: ProjectShareRow) => {
          const phone = row.shared_with_company?.phone?.trim() ?? "";
          return <span>{phone ? phone : emptyDash}</span>;
        },
      },
      {
        key: "shared_by",
        name: tTable("sharedBy"),
        sortable: true,
        render: (row: ProjectShareRow) => {
          const name = row.shared_by?.name?.trim() ?? "";
          return <span>{name ? name : emptyDash}</span>;
        },
      },
      {
        key: "created_at",
        name: tTable("sentDate"),
        sortable: true,
        render: (row: ProjectShareRow) => {
          const formatted = formatSentDate(row.created_at);
          return (
            <span>
              {formatted.trim() ? formatted : emptyDash}
            </span>
          );
        },
      },
      {
        key: "status",
        name: tTable("requestStatus"),
        sortable: true,
        render: (row: ProjectShareRow) => {
          const label = resolveShareStatusLabel(row.status, tStatus, emptyDash);
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
        name: tTable("actions"),
        sortable: false,
        render: () => (
          <CustomMenu
            renderAnchor={({ onClick }) => (
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={onClick}
              >
                {tTable("action")}
              </Button>
            )}
          >
            <MenuItem onClick={() => {}}>
              <EditIcon className="w-4 h-4 ml-2" />
              {tTable("edit")}
            </MenuItem>
          </CustomMenu>
        ),
      },
    ],
    [tTable, tStatus, emptyDash],
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
      awaiting: tWidgets("awaiting"),
      rejected: tWidgets("rejected"),
      accepted: tWidgets("accepted"),
      inProgress: tWidgets("inProgress"),
      total: tWidgets("total"),
    }),
    [tWidgets],
  );

  return (
    <Box sx={{ p: 3 }}>
      {sharesQuery.isError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("loadError")}
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
                  placeholder={t("searchPlaceholder")}
                />
              ) : undefined
            }
            customActions={
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ArrowDownUp className="h-4 w-4" />}
                  onClick={() => params.handleSort("shared_with_company")}
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
