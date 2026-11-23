"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Archive, CheckCircle2, Clock, Flag, Gavel } from "lucide-react";
import { Alert } from "@mui/material";
import HeadlessTableLayout from "@/components/headless/table";
import { Button } from "@/components/ui/button";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import StatCard from "../ui/StatCard";
import StatusChip from "../ui/StatusChip";
import FilterCard, { SearchFilter, SelectFilter } from "../ui/FilterCard";
import ReportReviewModal from "./ReportReviewModal";
import { useForumsList } from "../../hooks/use-forums";
import { useGroupsList } from "../../hooks/use-groups";
import { useReportsList } from "../../hooks/use-reports";
import { useDebounced } from "../../hooks/use-lookups";
import { useForumsTabs } from "../../context/ForumsTabsContext";
import { reportStatusLabel, reportStatusTone } from "../../utils/labels";
import { formatDate } from "../../utils/format";
import type { ForumReport, ReportStatus } from "../../types";

const Table = HeadlessTableLayout<ForumReport>("forum-reports");

export default function ReportsTab() {
  const t = useTranslations("Forums");
  const locale = useLocale();
  const { can } = usePermissions();
  const { reportsForumId, setReportsForumId } = useForumsTabs();

  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<ReportStatus | "">("");
  const [groupId, setGroupId] = useState("");
  const search = useDebounced(searchInput);

  const [activeReport, setActiveReport] = useState<ForumReport | null>(null);

  // Reports are scoped per forum, so the tab starts with a forum picker.
  const forums = useForumsList({ per_page: 100, status: "active" });
  const forumOptions = (forums.data?.items ?? []).map((forum) => ({
    value: forum.id,
    label: forum.name,
  }));

  const groups = useGroupsList(reportsForumId, { per_page: 100 });

  const tableParams = Table.useTableParams({ initialPage: 1, initialLimit: 10 });

  const params = useMemo(
    () => ({
      page: tableParams.page,
      per_page: tableParams.limit,
      search,
      status,
      group_id: groupId,
    }),
    [tableParams.page, tableParams.limit, search, status, groupId],
  );

  const { data, isLoading, isError } = useReportsList(
    reportsForumId,
    params,
    Boolean(reportsForumId),
  );

  const rows = data?.items ?? [];
  const stats = data?.stats ?? {};

  const columns = useMemo(
    () => [
      {
        key: "report",
        name: t("reports.columns.report"),
        sortable: false,
        minWidth: 260,
        render: (report: ForumReport) => (
          <div className="flex flex-col py-1">
            <span className="text-sm font-medium">{report.reason}</span>
            <span className="line-clamp-1 text-xs text-muted-foreground">
              {report.message?.body ?? "—"}
            </span>
          </div>
        ),
      },
      {
        key: "reporter",
        name: t("reports.columns.reporter"),
        sortable: false,
        minWidth: 150,
        render: (report: ForumReport) => (
          <span className="text-sm">{report.reporter?.name ?? "—"}</span>
        ),
      },
      {
        key: "group",
        name: t("reports.columns.group"),
        sortable: false,
        minWidth: 150,
        render: (report: ForumReport) => (
          <span className="text-sm">{report.group_name}</span>
        ),
      },
      {
        key: "status",
        name: t("common.status"),
        sortable: false,
        minWidth: 120,
        render: (report: ForumReport) => (
          <StatusChip
            label={reportStatusLabel(report.status, t)}
            tone={reportStatusTone(report.status)}
          />
        ),
      },
      {
        key: "created_at",
        name: t("common.date"),
        sortable: false,
        minWidth: 140,
        render: (report: ForumReport) => (
          <span className="text-sm">
            {formatDate(report.created_at, locale)}
          </span>
        ),
      },
      {
        key: "actions",
        name: t("common.actions"),
        sortable: false,
        align: "center" as const,
        minWidth: 120,
        render: (report: ForumReport) => {
          if (!can([PERMISSIONS.forum.report.update])) return null;
          const closed =
            report.status === "resolved" || report.status === "closed";
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveReport(report)}
              disabled={closed}
            >
              <Gavel />
              {t("reports.review")}
            </Button>
          );
        },
      },
    ],
    [t, locale, can],
  );

  const columnVisibility = Table.useColumnVisibility(columns);

  const tableState = Table.useTableState({
    data: rows,
    columns,
    totalPages: data?.pagination.last_page ?? 1,
    totalItems: data?.pagination.result_count ?? 0,
    params: tableParams,
    selectable: true,
    getRowId: (report) => report.id,
    loading: isLoading,
    searchable: false,
    filtered: Boolean(search || status || groupId),
    columnVisibility,
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-4">
        <StatCard
          label={t("reports.stats.new")}
          value={stats.new ?? 0}
          hint={t("reports.stats.newHint")}
          icon={<Flag />}
          tone="warning"
        />
        <StatCard
          label={t("reports.stats.inReview")}
          value={stats.in_review ?? 0}
          hint={t("reports.stats.inReviewHint")}
          icon={<Clock />}
        />
        <StatCard
          label={t("reports.stats.resolved")}
          value={stats.resolved ?? 0}
          hint={t("reports.stats.resolvedHint")}
          icon={<CheckCircle2 />}
          tone="success"
        />
        <StatCard
          label={t("reports.stats.closed")}
          value={stats.closed ?? 0}
          hint={t("reports.stats.closedHint")}
          icon={<Archive />}
          tone="neutral"
        />
      </div>

      <FilterCard>
        <SelectFilter
          label={t("reports.forumFilter")}
          value={reportsForumId}
          onChange={(value) => {
            setReportsForumId(value);
            setGroupId("");
            tableParams.setPage(1);
          }}
          placeholder={t("reports.pickForum")}
          options={forumOptions}
          disabled={forums.isLoading}
        />
        <SearchFilter
          label={t("common.search")}
          placeholder={t("reports.searchPlaceholder")}
          value={searchInput}
          onChange={(value) => {
            setSearchInput(value);
            tableParams.setPage(1);
          }}
        />
        <SelectFilter
          label={t("reports.groupFilter")}
          value={groupId}
          onChange={(value) => {
            setGroupId(value);
            tableParams.setPage(1);
          }}
          allLabel={t("common.allGroups")}
          options={(groups.data?.items ?? []).map((group) => ({
            value: group.id,
            label: group.name,
          }))}
          disabled={!reportsForumId}
        />
        <SelectFilter
          label={t("common.status")}
          value={status}
          onChange={(value) => {
            setStatus(value as ReportStatus | "");
            tableParams.setPage(1);
          }}
          allLabel={t("common.allStatuses")}
          options={[
            { value: "new", label: t("reports.statusValues.new") },
            { value: "in_review", label: t("reports.statusValues.in_review") },
            { value: "resolved", label: t("reports.statusValues.resolved") },
            { value: "closed", label: t("reports.statusValues.closed") },
          ]}
        />
      </FilterCard>

      {!reportsForumId ? (
        <Alert severity="info">{t("reports.pickForum")}</Alert>
      ) : null}

      {isError ? <Alert severity="error">{t("common.loadFailed")}</Alert> : null}

      {reportsForumId ? (
        <Table
          filters={<Table.TopActions state={tableState} />}
          table={<Table.Table state={tableState} loadingOptions={{ rows: 5 }} />}
          pagination={
            <Table.Pagination
              state={tableState}
              pageSizeOptions={[10, 15, 25, 50]}
            />
          }
        />
      ) : null}

      {activeReport ? (
        <ReportReviewModal
          forumId={reportsForumId}
          forumName={
            forumOptions.find((option) => option.value === reportsForumId)
              ?.label ?? ""
          }
          report={activeReport}
          onClose={() => setActiveReport(null)}
        />
      ) : null}
    </div>
  );
}
