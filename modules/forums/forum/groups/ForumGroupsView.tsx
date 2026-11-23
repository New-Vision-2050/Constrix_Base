"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Archive,
  ArchiveRestore,
  LayoutGrid,
  Lock,
  MessageSquareOff,
  Pencil,
  Plus,
  Settings2,
  Trash2,
  Users,
} from "lucide-react";
import { Alert } from "@mui/material";
import HeadlessTableLayout from "@/components/headless/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "@i18n/navigation";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { ROUTER } from "@/router";
import ForumShell from "../components/ForumShell";
import StatCard from "../../components/ui/StatCard";
import StatusChip from "../../components/ui/StatusChip";
import FilterCard, { SearchFilter, SelectFilter } from "../../components/ui/FilterCard";
import RowActionsMenu, { type RowAction } from "../../components/ui/RowActionsMenu";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import GroupDataModal from "./GroupDataModal";
import { useForum } from "../../hooks/use-forums";
import { useGroupStatusActions, useGroupsList } from "../../hooks/use-groups";
import { useDebounced } from "../../hooks/use-lookups";
import {
  allowedMediaLabel,
  groupStatusLabel,
  groupStatusTone,
  sendPermissionLabel,
} from "../../utils/labels";
import type { ForumGroup, GroupStatus, SendPermission } from "../../types";

const Table = HeadlessTableLayout<ForumGroup>("forum-groups");

export default function ForumGroupsView({ forumId }: { forumId: string }) {
  const t = useTranslations("Forums");
  const router = useRouter();
  const { can } = usePermissions();

  const { data: forum } = useForum(forumId);

  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<GroupStatus | "">("");
  const [sendPermission, setSendPermission] = useState<SendPermission | "">("");
  const search = useDebounced(searchInput);

  const [modalGroup, setModalGroup] = useState<ForumGroup | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingArchive, setPendingArchive] = useState<ForumGroup | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ForumGroup | null>(null);

  const tableParams = Table.useTableParams({ initialPage: 1, initialLimit: 10 });

  const params = useMemo(
    () => ({
      page: tableParams.page,
      per_page: tableParams.limit,
      search,
      status,
      send_permission: sendPermission,
    }),
    [tableParams.page, tableParams.limit, search, status, sendPermission],
  );

  const { data, isLoading, isError } = useGroupsList(forumId, params);
  const { archive, restore, remove } = useGroupStatusActions(forumId);

  const rows = data?.items ?? [];
  const stats = data?.stats ?? {};
  const readOnlyCount =
    stats.admins_only ??
    rows.filter((group) => group.send_permission === "admins_only").length;

  const openModal = (group: ForumGroup | null) => {
    setModalGroup(group);
    setModalOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        key: "name",
        name: t("forum.groups.columns.name"),
        sortable: false,
        minWidth: 220,
        render: (group: ForumGroup) => (
          <div className="flex items-center gap-2 py-1">
            <Avatar className="size-8">
              <AvatarImage src={group.icon_url ?? undefined} alt={group.name} />
              <AvatarFallback className="bg-primary/15 text-xs text-primary">
                {group.name?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{group.name}</span>
              {group.description ? (
                <span className="text-xs text-muted-foreground">
                  {group.description}
                </span>
              ) : null}
            </div>
          </div>
        ),
      },
      {
        key: "members_count",
        name: t("forum.groups.columns.members"),
        sortable: false,
        minWidth: 100,
        render: (group: ForumGroup) => <span>{group.members_count ?? 0}</span>,
      },
      {
        key: "admins_count",
        name: t("forum.groups.columns.admins"),
        sortable: false,
        minWidth: 100,
        render: (group: ForumGroup) => <span>{group.admins_count ?? 0}</span>,
      },
      {
        key: "send_permission",
        name: t("forum.groups.columns.sendPermission"),
        sortable: false,
        minWidth: 150,
        render: (group: ForumGroup) => (
          <span className="text-sm">
            {sendPermissionLabel(group.send_permission, t)}
          </span>
        ),
      },
      {
        key: "media",
        name: t("forum.groups.columns.media"),
        sortable: false,
        minWidth: 170,
        render: (group: ForumGroup) => (
          <span className="text-sm">{allowedMediaLabel(group, t)}</span>
        ),
      },
      {
        key: "status",
        name: t("common.status"),
        sortable: false,
        minWidth: 110,
        render: (group: ForumGroup) => (
          <StatusChip
            label={groupStatusLabel(group.status, t)}
            tone={groupStatusTone(group.status)}
          />
        ),
      },
      {
        key: "actions",
        name: t("common.actions"),
        sortable: false,
        align: "center" as const,
        minWidth: 120,
        render: (group: ForumGroup) => {
          const actions: RowAction[] = [];

          if (can([PERMISSIONS.forum.group.view])) {
            actions.push({
              key: "manage",
              label: t("forum.groups.menu.manage"),
              icon: <Users className="size-4" />,
              onSelect: () =>
                router.push(ROUTER.FORUM_GROUP_MEMBERS(forumId, group.id)),
            });
          }

          if (can([PERMISSIONS.forum.group.update])) {
            actions.push(
              {
                key: "edit",
                label: t("forum.groups.menu.editData"),
                icon: <Pencil className="size-4" />,
                onSelect: () => openModal(group),
              },
              {
                key: "send",
                label: t("forum.groups.menu.sendSettings"),
                icon: <Settings2 className="size-4" />,
                onSelect: () =>
                  router.push(
                    ROUTER.FORUM_GROUP_PERMISSIONS(forumId, group.id),
                  ),
              },
            );
          }

          if (
            group.status !== "archived" &&
            can([PERMISSIONS.forum.group.archive])
          ) {
            actions.push({
              key: "archive",
              label: t("forum.groups.menu.archive"),
              icon: <Archive className="size-4" />,
              onSelect: () => setPendingArchive(group),
            });
          }

          if (
            group.status === "archived" &&
            can([PERMISSIONS.forum.group.restore])
          ) {
            actions.push({
              key: "restore",
              label: t("forum.groups.menu.restore"),
              icon: <ArchiveRestore className="size-4" />,
              onSelect: () => restore.mutate(group.id),
            });
          }

          if (can([PERMISSIONS.forum.group.delete])) {
            actions.push({
              key: "delete",
              label: t("forum.groups.menu.delete"),
              icon: <Trash2 className="size-4" />,
              destructive: true,
              onSelect: () => setPendingDelete(group),
            });
          }

          return <RowActionsMenu actions={actions} />;
        },
      },
    ],
    [t, can, router, forumId, restore],
  );

  const columnVisibility = Table.useColumnVisibility(columns);
  const canCreate = can([PERMISSIONS.forum.group.create]);

  const tableState = Table.useTableState({
    data: rows,
    columns,
    totalPages: data?.pagination.last_page ?? 1,
    totalItems: data?.pagination.result_count ?? 0,
    params: tableParams,
    selectable: true,
    getRowId: (group) => group.id,
    loading: isLoading,
    searchable: false,
    filtered: Boolean(search || status || sendPermission),
    columnVisibility,
  });

  return (
    <ForumShell
      forumId={forumId}
      active="groups"
      title={t("forum.groups.title")}
      breadcrumb={t("forum.groups.breadcrumb")}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-4">
          <StatCard
            label={t("forum.groups.stats.total")}
            value={stats.total ?? rows.length}
            hint={t("forum.groups.stats.totalHint", {
              forum: forum?.name ?? "",
            })}
            icon={<LayoutGrid />}
          />
          <StatCard
            label={t("forum.groups.stats.active")}
            value={stats.active ?? 0}
            hint={t("forum.groups.stats.activeHint")}
            icon={<Users />}
            tone="success"
          />
          <StatCard
            label={t("forum.groups.stats.readOnly")}
            value={readOnlyCount}
            hint={t("forum.groups.stats.readOnlyHint")}
            icon={<Lock />}
            tone="warning"
          />
          <StatCard
            label={t("forum.groups.stats.archived")}
            value={stats.archived ?? 0}
            hint={t("forum.groups.stats.archivedHint")}
            icon={<MessageSquareOff />}
            tone="neutral"
          />
        </div>

        <FilterCard>
          <SearchFilter
            label={t("common.search")}
            placeholder={t("forum.groups.searchPlaceholder")}
            value={searchInput}
            onChange={(value) => {
              setSearchInput(value);
              tableParams.setPage(1);
            }}
          />
          <SelectFilter
            label={t("forum.groups.statusFilter")}
            value={status}
            onChange={(value) => {
              setStatus(value as GroupStatus | "");
              tableParams.setPage(1);
            }}
            allLabel={t("common.allStatuses")}
            options={[
              { value: "active", label: t("status.groupActive") },
              { value: "archived", label: t("status.groupArchived") },
            ]}
          />
          <SelectFilter
            label={t("forum.groups.sendFilter")}
            value={sendPermission}
            onChange={(value) => {
              setSendPermission(value as SendPermission | "");
              tableParams.setPage(1);
            }}
            allLabel={t("forum.groups.allSendModes")}
            options={[
              { value: "admins_only", label: t("sendPermission.admins_only") },
              { value: "all_members", label: t("sendPermission.all_members") },
              {
                value: "specific_members",
                label: t("sendPermission.specific_members"),
              },
            ]}
          />
        </FilterCard>

        {isError ? <Alert severity="error">{t("common.loadFailed")}</Alert> : null}

        <Table
          filters={
            <Table.TopActions
              state={tableState}
              customActions={
                canCreate ? (
                  <Button onClick={() => openModal(null)}>
                    <Plus />
                    {t("forum.groups.create")}
                  </Button>
                ) : null
              }
            />
          }
          table={<Table.Table state={tableState} loadingOptions={{ rows: 5 }} />}
          pagination={
            <Table.Pagination
              state={tableState}
              pageSizeOptions={[10, 15, 25, 50]}
            />
          }
        />
      </div>

      <GroupDataModal
        key={modalGroup?.id ?? "new"}
        open={modalOpen}
        forumId={forumId}
        group={modalGroup}
        onClose={() => setModalOpen(false)}
      />

      <ConfirmDialog
        open={Boolean(pendingArchive)}
        title={t("forum.groups.menu.archive")}
        body={t("forum.groups.archiveConfirm")}
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

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t("forum.groups.menu.delete")}
        body={t("forum.groups.deleteConfirm")}
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
    </ForumShell>
  );
}
