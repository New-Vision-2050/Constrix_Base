"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Archive,
  CheckCircle2,
  Megaphone,
  Pencil,
  Trash2,
} from "lucide-react";
import { Alert } from "@mui/material";
import HeadlessTableLayout from "@/components/headless/table";
import { useRouter } from "@i18n/navigation";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { ROUTER } from "@/router";
import StatCard from "../ui/StatCard";
import StatusChip from "../ui/StatusChip";
import FilterCard, { SearchFilter, SelectFilter } from "../ui/FilterCard";
import RowActionsMenu, { type RowAction } from "../ui/RowActionsMenu";
import ConfirmDialog from "../ui/ConfirmDialog";
import {
  useAnnouncementsList,
  useDeleteAnnouncement,
} from "../../hooks/use-announcements";
import { useDebounced } from "../../hooks/use-lookups";
import { useCurrentCompany } from "../../hooks/use-company";
import {
  announcementStatusLabel,
  announcementStatusTone,
} from "../../utils/labels";
import { formatDate } from "../../utils/format";
import type { Announcement, AnnouncementStatus } from "../../types";

const Table = HeadlessTableLayout<Announcement>("forum-announcements");

export default function AnnouncementsTab() {
  const t = useTranslations("Forums");
  const locale = useLocale();
  const router = useRouter();
  const { can } = usePermissions();
  const company = useCurrentCompany();

  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<AnnouncementStatus | "">("");
  const [authorId, setAuthorId] = useState("");
  const search = useDebounced(searchInput);

  const tableParams = Table.useTableParams({ initialPage: 1, initialLimit: 10 });

  const params = useMemo(
    () => ({
      page: tableParams.page,
      per_page: tableParams.limit,
      search,
      status,
      author_id: authorId,
    }),
    [tableParams.page, tableParams.limit, search, status, authorId],
  );

  const { data, isLoading, isError } = useAnnouncementsList(params);
  const remove = useDeleteAnnouncement();

  const [pendingDelete, setPendingDelete] = useState<Announcement | null>(null);

  const rows = useMemo(() => data?.items ?? [], [data?.items]);
  const stats = data?.stats ?? {};
  const draftsCount =
    stats.drafts ?? rows.filter((row) => row.status === "draft").length;

  // Publishers are derived from the loaded rows: the API has no authors lookup.
  const publisherOptions = useMemo(() => {
    const seen = new Map<string, string>();
    rows.forEach((row) => {
      if (row.author?.id) seen.set(row.author.id, row.author.name);
    });
    return Array.from(seen, ([value, label]) => ({ value, label }));
  }, [rows]);

  const columns = useMemo(
    () => [
      {
        key: "title",
        name: t("announcements.columns.title"),
        sortable: false,
        minWidth: 240,
        render: (row: Announcement) => (
          <div className="flex flex-col py-1">
            <span className="text-sm font-medium">{row.title}</span>
            <span className="line-clamp-1 text-xs text-muted-foreground">
              {row.body}
            </span>
          </div>
        ),
      },
      {
        key: "author",
        name: t("announcements.columns.author"),
        sortable: false,
        minWidth: 170,
        render: (row: Announcement) => (
          <span className="text-sm">{row.author?.name ?? "—"}</span>
        ),
      },
      {
        key: "scope",
        name: t("announcements.columns.scope"),
        sortable: false,
        minWidth: 170,
        // Announcements are company-wide; the API exposes no narrower scope.
        render: () => (
          <span className="text-sm">{t("announcements.allEmployees")}</span>
        ),
      },
      {
        key: "status",
        name: t("announcements.columns.status"),
        sortable: false,
        minWidth: 110,
        render: (row: Announcement) => (
          <StatusChip
            label={announcementStatusLabel(row.status, t)}
            tone={announcementStatusTone(row.status)}
          />
        ),
      },
      {
        key: "created_at",
        name: t("announcements.columns.date"),
        sortable: false,
        minWidth: 140,
        render: (row: Announcement) => (
          <span className="text-sm">{formatDate(row.created_at, locale)}</span>
        ),
      },
      {
        key: "actions",
        name: t("common.actions"),
        sortable: false,
        align: "center" as const,
        minWidth: 120,
        render: (row: Announcement) => {
          const actions: RowAction[] = [];

          if (can([PERMISSIONS.forum.announcement.update])) {
            actions.push({
              key: "edit",
              label: t("common.edit"),
              icon: <Pencil className="size-4" />,
              onSelect: () =>
                router.push(`${ROUTER.FORUM_ANNOUNCEMENT_NEW}?id=${row.id}`),
            });
          }

          if (can([PERMISSIONS.forum.announcement.delete])) {
            actions.push({
              key: "delete",
              label: t("common.delete"),
              icon: <Trash2 className="size-4" />,
              destructive: true,
              onSelect: () => setPendingDelete(row),
            });
          }

          return <RowActionsMenu actions={actions} />;
        },
      },
    ],
    [t, locale, can, router],
  );

  const tableState = Table.useTableState({
    data: rows,
    columns,
    totalPages: data?.pagination.last_page ?? 1,
    totalItems: data?.pagination.result_count ?? 0,
    params: tableParams,
    selectable: true,
    getRowId: (row) => row.id,
    loading: isLoading,
    searchable: false,
    filtered: Boolean(search || status || authorId),
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-4">
        <StatCard
          label={t("announcements.stats.total")}
          value={stats.total ?? rows.length}
          hint={company.name || t("announcements.stats.totalHint")}
          icon={<Megaphone />}
        />
        <StatCard
          label={t("announcements.stats.published")}
          value={stats.published ?? 0}
          hint={t("announcements.stats.publishedHint")}
          icon={<CheckCircle2 />}
          tone="success"
        />
        <StatCard
          label={t("announcements.stats.drafts")}
          value={draftsCount}
          hint={t("announcements.stats.draftsHint")}
          icon={<Pencil />}
          tone="warning"
        />
        {/* The API has no archived state for announcements; the card mirrors
            the design and stays at zero until the backend adds it. */}
        <StatCard
          label={t("announcements.stats.archived")}
          value={stats.archived ?? 0}
          hint={t("announcements.stats.archivedHint")}
          icon={<Archive />}
          tone="neutral"
        />
      </div>

      <FilterCard>
        <SearchFilter
          label={t("common.search")}
          placeholder={t("announcements.searchPlaceholder")}
          value={searchInput}
          onChange={(value) => {
            setSearchInput(value);
            tableParams.setPage(1);
          }}
        />
        <SelectFilter
          label={t("announcements.statusFilter")}
          value={status}
          onChange={(value) => {
            setStatus(value as AnnouncementStatus | "");
            tableParams.setPage(1);
          }}
          allLabel={t("common.allStatuses")}
          options={[
            { value: "published", label: t("announcements.statusValues.published") },
            { value: "draft", label: t("announcements.statusValues.draft") },
          ]}
        />
        <SelectFilter
          label={t("announcements.publisherFilter")}
          value={authorId}
          onChange={(value) => {
            setAuthorId(value);
            tableParams.setPage(1);
          }}
          allLabel={t("common.allPublishers")}
          options={publisherOptions}
        />
      </FilterCard>

      {isError ? <Alert severity="error">{t("common.loadFailed")}</Alert> : null}

      <div className="overflow-hidden rounded-xl border border-border">
        <Table
          table={<Table.Table state={tableState} loadingOptions={{ rows: 5 }} />}
          pagination={
            <Table.Pagination
              state={tableState}
              pageSizeOptions={[10, 15, 25, 50]}
            />
          }
        />
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t("announcements.deleteConfirmTitle")}
        body={t("announcements.deleteConfirmBody")}
        confirmLabel={t("common.delete")}
        destructive
        loading={remove.isPending}
        onConfirm={() => {
          if (!pendingDelete) return;
          remove.mutate(pendingDelete.id, {
            onSettled: () => setPendingDelete(null),
          });
        }}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
