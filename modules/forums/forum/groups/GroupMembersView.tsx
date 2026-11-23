"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Check,
  Info,
  LayoutGrid,
  Settings2,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { Alert } from "@mui/material";
import HeadlessTableLayout from "@/components/headless/table";
import { Button } from "@/components/ui/button";
import { Link } from "@i18n/navigation";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { ROUTER } from "@/router";
import { toast } from "@/modules/table/hooks/use-toast";
import ForumShell from "../components/ForumShell";
import SectionCard from "../../components/ui/SectionCard";
import StatusChip from "../../components/ui/StatusChip";
import InfoNote from "../../components/ui/InfoNote";
import RowActionsMenu, { type RowAction } from "../../components/ui/RowActionsMenu";
import EmployeePicker from "../../components/EmployeePicker";
import { readValidationErrors } from "../../api/client";
import {
  useGroupMembers,
  useGroupsList,
  useSaveGroupMembers,
} from "../../hooks/use-groups";
import { useDebounced, useEmployeeSearch } from "../../hooks/use-lookups";
import type { EmployeeOption, GroupMember, GroupMemberRole } from "../../types";

const Table = HeadlessTableLayout<GroupMember>("forum-group-members");

type Draft = { user_id: string; name: string; role: GroupMemberRole };

export default function GroupMembersView({
  forumId,
  groupId,
}: {
  forumId: string;
  groupId: string;
}) {
  const t = useTranslations("Forums");
  const { can } = usePermissions();

  const { data, isLoading, isError } = useGroupMembers(forumId, groupId);
  const save = useSaveGroupMembers(forumId, groupId);

  // The group name comes from the groups list; the members endpoint only
  // returns membership rows.
  const groups = useGroupsList(forumId, { per_page: 100 });
  const group = groups.data?.items.find((item) => item.id === groupId);

  const [draft, setDraft] = useState<Draft[]>([]);
  const [dirty, setDirty] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounced(searchInput);
  const directory = useEmployeeSearch({ search });

  // Hydrate the draft from the server rows until the user edits it.
  useEffect(() => {
    if (!data?.items || dirty) return;
    setDraft(
      data.items.map((member) => ({
        user_id: member.user_id,
        name: member.name,
        role: member.role,
      })),
    );
  }, [data?.items, dirty]);

  const tableParams = Table.useTableParams({ initialPage: 1, initialLimit: 10 });

  const rows = useMemo<GroupMember[]>(
    () =>
      draft.map((member) => {
        const original = data?.items.find(
          (item) => item.user_id === member.user_id,
        );
        return {
          user_id: member.user_id,
          name: member.name,
          employee_number: original?.employee_number ?? null,
          branch_name: original?.branch_name ?? null,
          role: member.role,
          can_send: original?.can_send ?? member.role === "admin",
        };
      }),
    [draft, data?.items],
  );

  const toggleEmployee = (employee: EmployeeOption) => {
    setDirty(true);
    setDraft((current) =>
      current.some((member) => member.user_id === employee.id)
        ? current.filter((member) => member.user_id !== employee.id)
        : [...current, { user_id: employee.id, name: employee.name, role: "member" }],
    );
  };

  const setRole = (userId: string, role: GroupMemberRole) => {
    setDirty(true);
    setDraft((current) =>
      current.map((member) =>
        member.user_id === userId ? { ...member, role } : member,
      ),
    );
  };

  const removeMember = (userId: string) => {
    setDirty(true);
    setDraft((current) =>
      current.filter((member) => member.user_id !== userId),
    );
  };

  const submit = () => {
    save.mutate(
      draft.map((member) => ({ user_id: member.user_id, role: member.role })),
      {
        onSuccess: () => {
          setDirty(false);
          toast({ title: t("common.saved") });
        },
        onError: (error) => {
          if (readValidationErrors(error)) return;
          toast({ variant: "destructive", title: t("common.saveFailed") });
        },
      },
    );
  };

  const canEdit = can([PERMISSIONS.forum.group.update]);

  const columns = useMemo(
    () => [
      {
        key: "name",
        name: t("common.employeeName"),
        sortable: false,
        minWidth: 200,
        render: (member: GroupMember) => (
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
        key: "role",
        name: t("common.role"),
        sortable: false,
        minWidth: 120,
        render: (member: GroupMember) => (
          <StatusChip
            label={
              member.role === "admin" ? t("roles.groupAdmin") : t("roles.member")
            }
            tone={member.role === "admin" ? "success" : "muted"}
          />
        ),
      },
      {
        key: "can_send",
        name: t("forum.groups.columns.sendPermission"),
        sortable: false,
        minWidth: 130,
        render: (member: GroupMember) => (
          <span className="text-sm">
            {member.can_send ? t("common.enabled") : t("common.disabled")}
          </span>
        ),
      },
      {
        key: "actions",
        name: t("common.actions"),
        sortable: false,
        align: "center" as const,
        minWidth: 120,
        render: (member: GroupMember) => {
          if (!canEdit) return null;
          const actions: RowAction[] = [
            member.role === "admin"
              ? {
                  key: "member",
                  label: t("forum.groupMembers.makeMember"),
                  icon: <UserRound className="size-4" />,
                  onSelect: () => setRole(member.user_id, "member"),
                }
              : {
                  key: "admin",
                  label: t("forum.groupMembers.makeAdmin"),
                  icon: <ShieldCheck className="size-4" />,
                  onSelect: () => setRole(member.user_id, "admin"),
                },
            {
              key: "remove",
              label: t("common.remove"),
              icon: <Trash2 className="size-4" />,
              destructive: true,
              onSelect: () => removeMember(member.user_id),
            },
          ];
          return <RowActionsMenu actions={actions} />;
        },
      },
    ],
    [t, canEdit],
  );

  const columnVisibility = Table.useColumnVisibility(columns);

  const tableState = Table.useTableState({
    data: rows,
    columns,
    totalPages: 1,
    totalItems: rows.length,
    params: tableParams,
    selectable: true,
    getRowId: (member) => member.user_id,
    loading: isLoading,
    searchable: false,
    filtered: false,
    columnVisibility,
  });

  const selectedIds = draft.map((member) => member.user_id);

  return (
    <ForumShell
      forumId={forumId}
      active="groups"
      title={t("forum.groupMembers.title", { group: group?.name ?? "" })}
      breadcrumb={t("forum.groups.breadcrumb")}
      action={
        canEdit ? (
          <Button onClick={submit} loading={save.isPending} disabled={!dirty}>
            <Check />
            {t("forum.groupMembers.save")}
          </Button>
        ) : null
      }
    >
      <div className="flex flex-col gap-5">
        {isError ? <Alert severity="error">{t("common.loadFailed")}</Alert> : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" asChild>
            <Link href={ROUTER.FORUM_GROUPS(forumId)}>
              <LayoutGrid />
              {t("forum.groupMembers.groupsList")}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={ROUTER.FORUM_GROUP_PERMISSIONS(forumId, groupId)}>
              <Settings2 />
              {t("forum.groupMembers.configureChat")}
            </Link>
          </Button>
        </div>

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

        <InfoNote icon={<Info />}>{t("forum.groupMembers.bulkHint")}</InfoNote>

        {canEdit ? (
          <SectionCard
            title={t("forum.groupMembers.addMembers")}
            hint={t("forum.members.addHint")}
          >
            <EmployeePicker
              search={searchInput}
              onSearchChange={setSearchInput}
              searchLabel={t("forum.members.directorySearch")}
              searchPlaceholder={t("forum.members.directoryPlaceholder")}
              employees={directory.data ?? []}
              loading={directory.isLoading}
              selectedIds={selectedIds}
              onToggle={toggleEmployee}
              badgeLabel={t("roles.member")}
              countLabel={t("wizard.members.selected", {
                count: draft.length,
              })}
            />
          </SectionCard>
        ) : null}
      </div>
    </ForumShell>
  );
}
