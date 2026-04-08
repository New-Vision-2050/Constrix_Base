"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
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
  const tProject = useTranslations("project");
  const tInbox = useTranslations("project.inbox");
  const tShare = useTranslations("project.share");
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
    return rawInvitations.map((inv) => mapPendingInvitationToRow(inv, tInbox));
  }, [rawInvitations, tInbox]);

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

  const acceptMutation = useMutation({
    mutationFn: (invitationId: string) =>
      ProjectSharingApi.acceptInvitation(invitationId),
    onSuccess: () => {
      toast.success(tInbox("acceptSuccess"));
      invalidate();
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorDescription(error) ?? tInbox("mutationError"));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (invitationId: string) =>
      ProjectSharingApi.rejectInvitation(invitationId),
    onSuccess: () => {
      toast.success(tInbox("rejectSuccess"));
      invalidate();
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorDescription(error) ?? tInbox("mutationError"));
    },
  });

  const pendingMutation =
    acceptMutation.isPending || rejectMutation.isPending;

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
        tProject,
        tInbox,
        tShare,
        pendingMutation,
        onAccept: (id) => acceptMutation.mutate(id),
        onReject: (id) => rejectMutation.mutate(id),
        onView: openDetails,
      }),
    [
      tProject,
      tInbox,
      tShare,
      acceptMutation,
      rejectMutation,
      pendingMutation,
      openDetails,
    ],
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
      documentType: tInbox("filterDocumentType"),
      status: tInbox("filterStatus"),
      sortBy: tInbox("filterSortBy"),
      all: tInbox("filterAll"),
      typeProject: tInbox("typeProject"),
      typeAttachment: tInbox("typeAttachment"),
      typeRequest: tInbox("typeRequest"),
      typeQuote: tInbox("typeQuote"),
      statusAll: tInbox("filterStatusAll"),
      statusAwaiting: tInbox("filterStatusAwaiting"),
      statusInProgress: tInbox("filterStatusInProgress"),
      statusAccepted: tInbox("filterStatusAccepted"),
      statusRejected: tInbox("filterStatusRejected"),
      sortDateNewest: tInbox("sortDateNewest"),
      sortDateOldest: tInbox("sortDateOldest"),
      sortNameAsc: tInbox("sortNameAsc"),
      sortNameDesc: tInbox("sortNameDesc"),
    }),
    [tInbox],
  );

  const widgetLabels = useMemo(
    () => ({
      awaiting: tInbox("widgetAwaiting"),
      rejected: tInbox("widgetRejected"),
      accepted: tInbox("widgetAccepted"),
      inProgress: tInbox("widgetInProgress"),
      total: tInbox("widgetTotal"),
    }),
    [tInbox],
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        {tInbox("title")}
      </Typography>

      {invitationsQuery.isError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {tInbox("loadError")}
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
              placeholder={tInbox("searchInInbox")}
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
        onApprove={() => {
          if (!detailsRow) return;
          acceptMutation.mutate(detailsRow.invitationId);
          closeDetails();
        }}
        onReject={() => {
          if (!detailsRow) return;
          rejectMutation.mutate(detailsRow.invitationId);
          closeDetails();
        }}
      />
    </Box>
  );
}

export default withPermissions(ProjectsInboxView, [
  PERMISSIONS.projectManagement.list,
]);
