"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Info, Trash2, UserPlus, Users } from "lucide-react";
import { Alert } from "@mui/material";
import HeadlessTableLayout from "@/components/headless/table";
import { Button } from "@/components/ui/button";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { toast } from "@/modules/table/hooks/use-toast";
import ForumShell from "../components/ForumShell";
import SectionCard from "../../components/ui/SectionCard";
import StatusChip from "../../components/ui/StatusChip";
import InfoNote from "../../components/ui/InfoNote";
import MultiSelect from "../../components/ui/MultiSelect";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import FilterCard, { SearchFilter, SelectFilter } from "../../components/ui/FilterCard";
import RowActionsMenu, { type RowAction } from "../../components/ui/RowActionsMenu";
import EmployeePicker from "../../components/EmployeePicker";
import { readValidationErrors } from "../../api/client";
import { useGroupsList } from "../../hooks/use-groups";
import {
  useForumMembers,
  useSaveForumMembers,
  useSaveMemberGroups,
} from "../../hooks/use-members";
import { useDebounced, useEmployeeSearch } from "../../hooks/use-lookups";
import type { EmployeeOption, ForumMember } from "../../types";

const Table = HeadlessTableLayout<ForumMember>("forum-members");

export default function ForumMembersView({ forumId }: { forumId: string }) {
  const t = useTranslations("Forums");
  const { can } = usePermissions();
  const canEdit = can([PERMISSIONS.forum.member.update]);

  const [searchInput, setSearchInput] = useState("");
  const [groupId, setGroupId] = useState("");
  const search = useDebounced(searchInput);

  const tableParams = Table.useTableParams({ initialPage: 1, initialLimit: 10 });

  const params = useMemo(
    () => ({
      page: tableParams.page,
      per_page: tableParams.limit,
      search,
      group_id: groupId,
    }),
    [tableParams.page, tableParams.limit, search, groupId],
  );

  const { data, isLoading, isError } = useForumMembers(forumId, params);
  const groups = useGroupsList(forumId, { per_page: 100, status: "active" });
  const saveMembers = useSaveForumMembers(forumId);
  const saveMemberGroups = useSaveMemberGroups(forumId);

  const rows = useMemo(() => data?.items ?? [], [data?.items]);
  const memberIds = useMemo(
    () => rows.map((member) => member.user_id),
    [rows],
  );

  // «توزيع الموظفين على المجموعات»: the selected rows get the chosen groups.
  const [distributionGroups, setDistributionGroups] = useState<string[]>([]);
  const [pendingRemoval, setPendingRemoval] = useState<ForumMember | null>(null);

  // Directory card used to add new employees to the forum.
  const [directorySearch, setDirectorySearch] = useState("");
  const [pickedIds, setPickedIds] = useState<string[]>([]);
  const debouncedDirectory = useDebounced(directorySearch);
  const directory = useEmployeeSearch({ search: debouncedDirectory });

  const groupOptions = (groups.data?.items ?? []).map((group) => ({
    id: group.id,
    name: group.name,
  }));

  const addPicked = () => {
    if (pickedIds.length === 0) return;
    const next = Array.from(new Set([...memberIds, ...pickedIds]));
    saveMembers.mutate(next, {
      onSuccess: () => {
        setPickedIds([]);
        setDirectorySearch("");
        toast({ title: t("common.saved") });
      },
      onError: (error) => {
        if (readValidationErrors(error)) return;
        toast({ variant: "destructive", title: t("common.saveFailed") });
      },
    });
  };

  const removeMember = (member: ForumMember) => {
    saveMembers.mutate(
      memberIds.filter((id) => id !== member.user_id),
      {
        onSuccess: () => {
          setPendingRemoval(null);
          toast({ title: t("common.saved") });
        },
        onError: (error) => {
          setPendingRemoval(null);
          if (readValidationErrors(error)) return;
          toast({ variant: "destructive", title: t("common.saveFailed") });
        },
      },
    );
  };

  const columns = useMemo(
    () => [
      {
        key: "name",
        name: t("common.employeeName"),
        sortable: false,
        minWidth: 200,
        render: (member: ForumMember) => (
          <div className="flex flex-col py-1">
            <span className="text-sm font-medium">{member.name}</span>
            <span className="text-xs text-muted-foreground">
              {[member.employee_number, member.branch_name]
                .filter(Boolean)
                .join(" • ")}
            </span>
          </div>
        ),
      },
      {
        key: "forum_role",
        name: t("common.role"),
        sortable: false,
        minWidth: 130,
        render: (member: ForumMember) => (
          <StatusChip
            label={
              member.forum_role === "admin"
                ? t("roles.forumAdmin")
                : t("roles.member")
            }
            tone={member.forum_role === "admin" ? "success" : "muted"}
          />
        ),
      },
      {
        key: "groups",
        name: t("common.groups"),
        sortable: false,
        minWidth: 220,
        render: (member: ForumMember) => {
          if (!member.groups || member.groups.length === 0) {
            return (
              <span className="text-xs text-muted-foreground">
                {t("forum.members.noGroups")}
              </span>
            );
          }
          return (
            <div className="flex flex-wrap gap-1.5 py-1">
              {member.groups.map((group) => (
                <span
                  key={group.id}
                  className="rounded-md bg-primary/15 px-2 py-0.5 text-xs text-primary"
                >
                  {group.name}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        key: "groups_count",
        name: t("forum.members.showGroups"),
        sortable: false,
        minWidth: 120,
        render: (member: ForumMember) => {
          const count = member.groups?.length ?? 0;
          return (
            <span className="text-sm">
              {count === 1
                ? t("forum.members.groupsCountOne")
                : t("forum.members.groupsCountMany", { count })}
            </span>
          );
        },
      },
      {
        key: "actions",
        name: t("common.actions"),
        sortable: false,
        align: "center" as const,
        minWidth: 120,
        render: (member: ForumMember) => {
          if (!canEdit) return null;
          const actions: RowAction[] = [
            {
              key: "remove",
              label: t("forum.members.removeFromForum"),
              icon: <Trash2 className="size-4" />,
              destructive: true,
              onSelect: () => setPendingRemoval(member),
            },
          ];
          return <RowActionsMenu actions={actions} />;
        },
      },
    ],
    [t, canEdit],
  );

  const tableState = Table.useTableState({
    data: rows,
    columns,
    totalPages: data?.pagination.last_page ?? 1,
    totalItems: data?.pagination.result_count ?? 0,
    params: tableParams,
    selectable: true,
    getRowId: (member) => member.user_id,
    loading: isLoading,
    searchable: false,
    filtered: Boolean(search || groupId),
  });

  const selectedRowIds = tableState.selection.selectedRows.map(
    (member) => member.user_id,
  );

  const saveDistribution = () => {
    if (selectedRowIds.length === 0 || distributionGroups.length === 0) return;

    // One request per member: the API scopes group membership per user.
    Promise.all(
      selectedRowIds.map((userId) =>
        saveMemberGroups.mutateAsync({
          userId,
          groups: distributionGroups.map((group_id) => ({
            group_id,
            role: "member" as const,
          })),
        }),
      ),
    )
      .then(() => {
        setDistributionGroups([]);
        tableState.selection.clearSelection();
        toast({ title: t("common.saved") });
      })
      .catch(() =>
        toast({ variant: "destructive", title: t("common.saveFailed") }),
      );
  };

  return (
    <ForumShell
      forumId={forumId}
      active="members"
      title={t("forum.tabs.members")}
      breadcrumb={t("forum.members.addTitle")}
    >
      <div className="flex flex-col gap-5">
        {isError ? <Alert severity="error">{t("common.loadFailed")}</Alert> : null}

        <FilterCard>
          <SearchFilter
            label={t("common.search")}
            placeholder={t("forum.members.directoryPlaceholder")}
            value={searchInput}
            onChange={(value) => {
              setSearchInput(value);
              tableParams.setPage(1);
            }}
          />
          <SelectFilter
            label={t("forum.members.groupFilter")}
            value={groupId}
            onChange={(value) => {
              setGroupId(value);
              tableParams.setPage(1);
            }}
            allLabel={t("common.allGroups")}
            options={groupOptions.map((group) => ({
              value: group.id,
              label: group.name,
            }))}
          />
        </FilterCard>

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

        {canEdit ? (
          <SectionCard
            title={t("forum.members.distributeTitle")}
            hint={t("forum.members.distributeHint")}
          >
            <div className="flex flex-col gap-3">
              <MultiSelect
                label={t("common.groups")}
                placeholder={t("common.allGroups")}
                options={groupOptions}
                value={distributionGroups}
                onChange={setDistributionGroups}
                loading={groups.isLoading}
              />
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={saveDistribution}
                  loading={saveMemberGroups.isPending}
                  disabled={
                    selectedRowIds.length === 0 ||
                    distributionGroups.length === 0
                  }
                >
                  <Check />
                  {t("forum.members.saveDistribution")}
                </Button>
                <span className="text-xs text-muted-foreground">
                  {t("wizard.members.selected", {
                    count: selectedRowIds.length,
                  })}
                </span>
              </div>
              <InfoNote icon={<Users />}>
                {t("forum.members.removeConfirm")}
              </InfoNote>
            </div>
          </SectionCard>
        ) : null}

        {canEdit ? (
          <SectionCard
            title={t("forum.members.addTitle")}
            hint={t("forum.members.addHint")}
          >
            <EmployeePicker
              search={directorySearch}
              onSearchChange={setDirectorySearch}
              searchLabel={t("forum.members.directorySearch")}
              searchPlaceholder={t("forum.members.directoryPlaceholder")}
              employees={(directory.data ?? []).filter(
                (employee) => !memberIds.includes(employee.id),
              )}
              loading={directory.isLoading}
              selectedIds={pickedIds}
              onToggle={(employee: EmployeeOption) =>
                setPickedIds((current) =>
                  current.includes(employee.id)
                    ? current.filter((id) => id !== employee.id)
                    : [...current, employee.id],
                )
              }
              badgeLabel={t("roles.member")}
              countLabel={t("wizard.members.selected", {
                count: pickedIds.length,
              })}
              onClearSelection={() => setPickedIds([])}
              clearLabel={t("wizard.members.clearSelection")}
              footer={
                <div className="flex flex-col gap-3">
                  <InfoNote icon={<Info />}>
                    {t("forum.members.distributionNote")}
                  </InfoNote>
                  <Button
                    onClick={addPicked}
                    loading={saveMembers.isPending}
                    disabled={pickedIds.length === 0}
                  >
                    <UserPlus />
                    {t("forum.members.addMembers")}
                  </Button>
                </div>
              }
            />
          </SectionCard>
        ) : null}
      </div>

      <ConfirmDialog
        open={Boolean(pendingRemoval)}
        title={t("forum.members.removeFromForum")}
        body={t("forum.members.removeConfirm")}
        confirmLabel={t("common.remove")}
        destructive
        loading={saveMembers.isPending}
        onConfirm={() => pendingRemoval && removeMember(pendingRemoval)}
        onClose={() => setPendingRemoval(null)}
      />
    </ForumShell>
  );
}
