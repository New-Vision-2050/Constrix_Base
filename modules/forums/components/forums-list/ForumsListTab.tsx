"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Archive,
  ArchiveRestore,
  CheckCircle2,
  MessagesSquare,
  Pencil,
  Settings2,
} from "lucide-react";
import { Alert } from "@mui/material";
import HeadlessTableLayout from "@/components/headless/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  useArchiveForum,
  useForumsList,
  useRestoreForum,
} from "../../hooks/use-forums";
import { useDebounced } from "../../hooks/use-lookups";
import { useCurrentCompany } from "../../hooks/use-company";
import { forumStatusLabel, forumStatusTone } from "../../utils/labels";
import { formatDate } from "../../utils/format";
import type { Forum, ForumStatus } from "../../types";

const Table = HeadlessTableLayout<Forum>("forums");

export default function ForumsListTab() {
  const t = useTranslations("Forums");
  const locale = useLocale();
  const router = useRouter();
  const { can } = usePermissions();
  const company = useCurrentCompany();

  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<ForumStatus | "">("");
  const search = useDebounced(searchInput);

  const tableParams = Table.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const params = useMemo(
    () => ({
      page: tableParams.page,
      per_page: tableParams.limit,
      search,
      status,
    }),
    [tableParams.page, tableParams.limit, search, status],
  );

  const { data, isLoading, isError } = useForumsList(params);
  const archive = useArchiveForum();
  const restore = useRestoreForum();

  const [pendingArchive, setPendingArchive] = useState<Forum | null>(null);

  const rows = data?.items ?? [];

  // `stats` carries `open_reports` rather than a draft counter, so the drafts
  // card falls back to counting the rows currently loaded.
  const stats = data?.stats ?? {};
  const draftsCount =
    stats.drafts ?? rows.filter((forum) => forum.status === "draft").length;

  const columns = useMemo(
    () => [
      {
        key: "name",
        name: t("list.columns.name"),
        sortable: false,
        minWidth: 220,
        render: (forum: Forum) => (
          <div className="flex items-center gap-2 py-1">
            <Avatar className="size-8">
              <AvatarImage src={forum.logo_url ?? undefined} alt={forum.name} />
              <AvatarFallback className="bg-primary/15 text-xs text-primary">
                {forum.name?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{forum.name}</span>
          </div>
        ),
      },
      {
        key: "company",
        name: t("list.columns.company"),
        sortable: false,
        minWidth: 160,
        render: () => <span className="text-sm">{company.name || "—"}</span>,
      },
      {
        key: "groups_count",
        name: t("list.columns.groups"),
        sortable: false,
        minWidth: 100,
        render: (forum: Forum) => <span>{forum.groups_count ?? 0}</span>,
      },
      {
        key: "members_count",
        name: t("list.columns.members"),
        sortable: false,
        minWidth: 100,
        render: (forum: Forum) => <span>{forum.members_count ?? 0}</span>,
      },
      {
        key: "status",
        name: t("list.columns.status"),
        sortable: false,
        minWidth: 110,
        render: (forum: Forum) => (
          <StatusChip
            label={forumStatusLabel(forum.status, t)}
            tone={forumStatusTone(forum.status)}
          />
        ),
      },
      {
        key: "last_activity_at",
        name: t("list.columns.lastActivity"),
        sortable: false,
        minWidth: 150,
        render: (forum: Forum) => (
          <span className="text-sm">
            {formatDate(forum.last_activity_at ?? forum.created_at, locale)}
          </span>
        ),
      },
      {
        key: "actions",
        name: t("common.actions"),
        sortable: false,
        align: "center" as const,
        minWidth: 120,
        render: (forum: Forum) => {
          const actions: RowAction[] = [];

          if (can([PERMISSIONS.forum.view])) {
            actions.push({
              key: "manage",
              label: t("common.manage"),
              icon: <Settings2 className="size-4" />,
              onSelect: () => router.push(ROUTER.FORUM_DETAILS(forum.id)),
            });
          }

          if (forum.status !== "archived" && can([PERMISSIONS.forum.archive])) {
            actions.push({
              key: "archive",
              label: t("common.archive"),
              icon: <Archive className="size-4" />,
              destructive: true,
              onSelect: () => setPendingArchive(forum),
            });
          }

          if (forum.status === "archived" && can([PERMISSIONS.forum.restore])) {
            actions.push({
              key: "restore",
              label: t("common.restore"),
              icon: <ArchiveRestore className="size-4" />,
              onSelect: () => restore.mutate(forum.id),
            });
          }

          return <RowActionsMenu actions={actions} />;
        },
      },
    ],
    [t, locale, company.name, can, router, restore],
  );

  const tableState = Table.useTableState({
    data: rows,
    columns,
    totalPages: data?.pagination.last_page ?? 1,
    totalItems: data?.pagination.result_count ?? 0,
    params: tableParams,
    selectable: true,
    getRowId: (forum) => forum.id,
    loading: isLoading,
    searchable: false,
    filtered: Boolean(search || status),
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-4">
        <StatCard
          label={t("list.stats.total")}
          value={stats.total ?? rows.length}
          hint={company.name}
          icon={<MessagesSquare />}
        />
        <StatCard
          label={t("list.stats.published")}
          value={stats.active ?? stats.published ?? 0}
          hint={t("list.stats.publishedHint")}
          icon={<CheckCircle2 />}
          tone="success"
        />
        <StatCard
          label={t("list.stats.drafts")}
          value={draftsCount}
          hint={t("list.stats.draftsHint")}
          icon={<Pencil />}
          tone="warning"
        />
        <StatCard
          label={t("list.stats.archived")}
          value={stats.archived ?? 0}
          hint={t("list.stats.archivedHint")}
          icon={<Archive />}
          tone="neutral"
        />
      </div>

      <FilterCard>
        <SearchFilter
          label={t("common.search")}
          placeholder={t("list.searchPlaceholder")}
          value={searchInput}
          onChange={(value) => {
            setSearchInput(value);
            tableParams.setPage(1);
          }}
        />
        {/* The forum API has no company scope: the module always shows the
            signed-in company, so this filter is informational. */}
        <SelectFilter
          label={t("common.company")}
          value={company.id}
          onChange={() => undefined}
          options={
            company.id ? [{ value: company.id, label: company.name }] : []
          }
          placeholder={company.name}
          disabled
        />
        <SelectFilter
          label={t("common.status")}
          value={status}
          onChange={(value) => {
            setStatus(value as ForumStatus | "");
            tableParams.setPage(1);
          }}
          allLabel={t("common.allStatuses")}
          options={[
            { value: "active", label: t("status.active") },
            { value: "draft", label: t("status.draft") },
            { value: "archived", label: t("status.archived") },
          ]}
        />
      </FilterCard>

      {isError ? (
        <Alert severity="error">{t("common.loadFailed")}</Alert>
      ) : null}

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
        open={Boolean(pendingArchive)}
        title={t("list.archiveConfirmTitle")}
        body={t("list.archiveConfirmBody")}
        confirmLabel={t("common.archive")}
        destructive
        loading={archive.isPending}
        onConfirm={() => {
          if (!pendingArchive) return;
          archive.mutate(pendingArchive.id, {
            onSettled: () => setPendingArchive(null),
          });
        }}
        onClose={() => setPendingArchive(null)}
      />
    </div>
  );
}
