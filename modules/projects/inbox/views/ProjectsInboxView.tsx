"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Box, Typography } from "@mui/material";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import withPermissions from "@/lib/permissions/client/withPermissions";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { ProjectSharingApi } from "@/services/api/projects/project-sharing";
import {
  mapPendingInvitationToRow,
  type ProjectInboxRow,
  type InboxTypeKey,
} from "@/modules/projects/inbox/map-invitation-to-row";
import InboxDetailsDialog from "@/modules/projects/inbox/components/InboxDetailsDialog";
import type { PendingShareInvitation } from "@/services/api/projects/project-sharing/types/response";
import { getInboxColumns } from "@/modules/projects/inbox/inbox-columns";
import {
  countInboxSegments,
  inboxInvitationStatusSegment,
  type InboxStatusSegment,
} from "@/modules/projects/inbox/inbox-status-segment";
import InboxStatsWidgets from "@/modules/projects/inbox/components/InboxStatsWidgets";
import InboxFiltersBar, {
  type InboxSortPreset,
} from "@/modules/projects/inbox/components/InboxFiltersBar";
import axios from "axios";

const INBOX_QUERY_KEY = "project-inbox-pending";

const InboxTableLayout = HeadlessTableLayout<ProjectInboxRow>("project-inbox");

function getApiErrorDescription(error: unknown): string | undefined {
  const data = axios.isAxiosError(error)
    ? error.response?.data
    : (error as { response?: { data?: unknown } })?.response?.data;
  if (!data || typeof data !== "object") return undefined;
  const body = data as { description?: string; message?: unknown };
  if (typeof body.description === "string" && body.description.trim())
    return body.description.trim();
  if (typeof body.message === "string") return body.message;
  return undefined;
}

function applyInboxSort(
  rows: ProjectInboxRow[],
  preset: InboxSortPreset,
): ProjectInboxRow[] {
  const copy = [...rows];
  switch (preset) {
    case "date_desc":
      return copy.sort((a, b) => {
        const ta = new Date(a.sent_at_raw).getTime();
        const tb = new Date(b.sent_at_raw).getTime();
        const na = Number.isNaN(ta) ? 0 : ta;
        const nb = Number.isNaN(tb) ? 0 : tb;
        return nb - na;
      });
    case "date_asc":
      return copy.sort((a, b) => {
        const ta = new Date(a.sent_at_raw).getTime();
        const tb = new Date(b.sent_at_raw).getTime();
        const na = Number.isNaN(ta) ? 0 : ta;
        const nb = Number.isNaN(tb) ? 0 : tb;
        return na - nb;
      });
    case "name_asc":
      return copy.sort((a, b) =>
        String(a.name ?? "").localeCompare(String(b.name ?? ""), undefined, {
          numeric: true,
        }),
      );
    case "name_desc":
      return copy.sort((a, b) =>
        String(b.name ?? "").localeCompare(String(a.name ?? ""), undefined, {
          numeric: true,
        }),
      );
    default:
      return copy;
  }
}

function ProjectsInboxView() {
  const t = useTranslations("project.inbox");
  const queryClient = useQueryClient();

  const [documentType, setDocumentType] = useState<"all" | InboxTypeKey>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | InboxStatusSegment>(
    "all",
  );
  const [sortPreset, setSortPreset] = useState<InboxSortPreset>("date_desc");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsRow, setDetailsRow] = useState<ProjectInboxRow | null>(null);

  const params = InboxTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
    initialSortBy: "sent_at_raw",
    initialSortDirection: "desc",
  });

  const invitationsQuery = useQuery({
    queryKey: [INBOX_QUERY_KEY],
    queryFn: async () => {
      const res = await ProjectSharingApi.getPendingInvitations();
      return res.data?.payload ?? [];
    },
  });

  const rawInvitations = useMemo(
    () => invitationsQuery.data ?? [],
    [invitationsQuery.data],
  );

  const invitationsById = useMemo(() => {
    const m = new Map<string, PendingShareInvitation>();
    for (const inv of rawInvitations) {
      m.set(inv.id, inv);
    }
    return m;
  }, [rawInvitations]);

  const allRows = useMemo(() => {
    return rawInvitations.map((inv) => mapPendingInvitationToRow(inv));
  }, [rawInvitations]);

  const segmentCounts = useMemo(() => countInboxSegments(allRows), [allRows]);

  const searchFiltered = useMemo(() => {
    const q = params.search.trim().toLowerCase();
    let rows = allRows;

    if (documentType !== "all") {
      rows = rows.filter((row) => row.inbox_type_key === documentType);
    }

    if (statusFilter !== "all") {
      rows = rows.filter(
        (row) =>
          inboxInvitationStatusSegment(row.invitation_status) ===
          statusFilter,
      );
    }

    if (!q) return rows;
    return rows.filter((row) =>
      [
        String(row.reference_display ?? ""),
        String(row.name ?? ""),
        String(row.sender_company_name ?? ""),
        String(row.representative_name ?? ""),
        String(row.inbox_type_label ?? ""),
        String(row.inbox_type_key ?? ""),
        String(row.invitation_status ?? ""),
        String(row.sent_at_raw ?? ""),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [allRows, params.search, documentType, statusFilter]);

  const sortedRows = useMemo(
    () => applyInboxSort(searchFiltered, sortPreset),
    [searchFiltered, sortPreset],
  );

  const pageData = useMemo(() => {
    const start = (params.page - 1) * params.limit;
    return sortedRows.slice(start, start + params.limit);
  }, [sortedRows, params.page, params.limit]);

  const totalItems = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / params.limit));

  const { setPage, search: searchParam } = params;

  useEffect(() => {
    setPage(1);
  }, [documentType, statusFilter, sortPreset, searchParam, setPage]);

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [INBOX_QUERY_KEY] });
  }, [queryClient]);

  /** Single POST `invitations/respond` — same as Postman (action: accept | reject). */
  const respondToShareMutation = useMutation({
    mutationFn: (vars: {
      shareId: string;
      action: "accept" | "reject";
      comment?: string;
    }) =>
      ProjectSharingApi.respondToShareInvitation({
        share_id: vars.shareId,
        action: vars.action,
        comment: vars.comment,
      }),
    onSuccess: (_data, vars) => {
      toast.success(
        vars.action === "accept"
          ? t("toastAcceptSuccess")
          : t("toastRejectSuccess"),
      );
      invalidate();
    },
    onError: (error: unknown) => {
      toast.error(
        getApiErrorDescription(error) ?? t("toastOperationError"),
      );
    },
  });

  const pendingMutation = respondToShareMutation.isPending;

  const openDetails = useCallback((row: ProjectInboxRow) => {
    setDetailsRow(row);
    setDetailsOpen(true);
  }, []);

  const closeDetails = useCallback(() => {
    setDetailsOpen(false);
    setDetailsRow(null);
  }, []);

  const detailsInvitation = detailsRow
    ? invitationsById.get(detailsRow.invitationId) ?? null
    : null;

  const detailsCanRespond =
    (detailsRow?.invitation_status ?? "").trim().toLowerCase() === "pending";

  const columns = useMemo(
    () =>
      getInboxColumns({
        t,
        pendingMutation,
        onAccept: (id) =>
          respondToShareMutation.mutate({ shareId: id, action: "accept" }),
        onReject: (id) =>
          respondToShareMutation.mutate({ shareId: id, action: "reject" }),
        onView: openDetails,
      }),
    [t, respondToShareMutation, pendingMutation, openDetails],
  );

  const isFiltered =
    params.search.trim().length > 0 ||
    documentType !== "all" ||
    statusFilter !== "all";

  const state = InboxTableLayout.useTableState({
    data: pageData,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row) => row.invitationId,
    loading: invitationsQuery.isLoading,
    searchable: true,
    filtered: isFiltered,
    onExport: async () => {},
  });

  const filterLabels = useMemo(
    () => ({
      documentType: t("filterDocumentType"),
      status: t("filterStatus"),
      sortBy: t("filterSortBy"),
      all: t("filterAll"),
      typeProject: t("typeProject"),
      typeAttachment: t("typeAttachment"),
      typeRequest: t("typeRequest"),
      typeQuote: t("typeQuote"),
      statusAll: t("filterStatusAll"),
      statusAwaiting: t("filterStatusAwaiting"),
      statusInProgress: t("filterStatusInProgress"),
      statusAccepted: t("filterStatusAccepted"),
      statusRejected: t("filterStatusRejected"),
      sortDateNewest: t("sortDateNewest"),
      sortDateOldest: t("sortDateOldest"),
      sortNameAsc: t("sortNameAsc"),
      sortNameDesc: t("sortNameDesc"),
    }),
    [t],
  );

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
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        {t("listTitle")}
      </Typography>

      {invitationsQuery.isError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("listLoadError")}
        </Alert>
      ) : null}

      <InboxStatsWidgets counts={segmentCounts} labels={widgetLabels} />

      <InboxFiltersBar
        documentType={documentType}
        onDocumentTypeChange={setDocumentType}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        sortPreset={sortPreset}
        onSortPresetChange={setSortPreset}
        labels={filterLabels}
        searchComponent={
          state.table.searchable ? (
            <InboxTableLayout.Search
              search={state.search}
              placeholder={t("searchPlaceholder")}
            />
          ) : undefined
        }
      />

      <InboxTableLayout
        table={
          <InboxTableLayout.Table
            state={state}
            loadingOptions={{ rows: 5 }}
          />
        }
        pagination={<InboxTableLayout.Pagination state={state} />}
      />

      <InboxDetailsDialog
        open={detailsOpen}
        onClose={closeDetails}
        row={detailsRow}
        invitation={detailsInvitation}
        canRespond={detailsCanRespond}
        actionPending={pendingMutation}
        onApprove={(comment) => {
          if (!detailsRow) return;
          respondToShareMutation.mutate(
            {
              shareId: detailsRow.invitationId,
              action: "accept",
              comment,
            },
            { onSuccess: () => closeDetails() },
          );
        }}
        onReject={(comment) => {
          if (!detailsRow) return;
          respondToShareMutation.mutate(
            {
              shareId: detailsRow.invitationId,
              action: "reject",
              comment,
            },
            { onSuccess: () => closeDetails() },
          );
        }}
      />
    </Box>
  );
}

export default withPermissions(ProjectsInboxView, [
  PERMISSIONS.projectManagement.list,
]);
