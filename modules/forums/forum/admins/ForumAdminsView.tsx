"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Info, LayoutGrid, ShieldCheck, Trash2, UserPlus } from "lucide-react";
import { Alert } from "@mui/material";
import HeadlessTableLayout from "@/components/headless/table";
import { Button } from "@/components/ui/button";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { toast } from "@/modules/table/hooks/use-toast";
import ForumShell from "../components/ForumShell";
import SectionCard from "../../components/ui/SectionCard";
import StatusChip from "../../components/ui/StatusChip";
import SwitchRow from "../../components/ui/SwitchRow";
import InfoNote from "../../components/ui/InfoNote";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import RowActionsMenu, { type RowAction } from "../../components/ui/RowActionsMenu";
import EmployeePicker from "../../components/EmployeePicker";
import { readValidationErrors } from "../../api/client";
import { useForumAdmins, useSaveForumAdmins } from "../../hooks/use-members";
import { useDebounced, useEmployeeSearch } from "../../hooks/use-lookups";
import type { EmployeeOption, ForumAdmin, ForumAdminInput } from "../../types";

const Table = HeadlessTableLayout<ForumAdmin>("forum-admins");

export default function ForumAdminsView({ forumId }: { forumId: string }) {
  const t = useTranslations("Forums");
  const { can } = usePermissions();
  const canEdit = can([PERMISSIONS.forum.admin.update]);

  const { data, isLoading, isError } = useForumAdmins(forumId);
  const save = useSaveForumAdmins(forumId);

  const admins = useMemo(() => data?.items ?? [], [data?.items]);

  const [searchInput, setSearchInput] = useState("");
  const [pickedIds, setPickedIds] = useState<string[]>([]);
  const [canManageGroups, setCanManageGroups] = useState(true);
  const [canPublish, setCanPublish] = useState(true);
  const [pendingRemoval, setPendingRemoval] = useState<ForumAdmin | null>(null);

  const search = useDebounced(searchInput);
  const directory = useEmployeeSearch({ search });

  const tableParams = Table.useTableParams({ initialPage: 1, initialLimit: 10 });

  const toInput = (admin: ForumAdmin): ForumAdminInput => ({
    user_id: admin.user_id,
    can_manage_groups: admin.can_manage_groups,
    can_publish_announcements: admin.can_publish_announcements,
  });

  const persist = useCallback(
    (next: ForumAdminInput[], onDone?: () => void) => {
      save.mutate(next, {
        onSuccess: () => {
          onDone?.();
          toast({ title: t("common.saved") });
        },
        onError: (error) => {
          onDone?.();
          if (readValidationErrors(error)) return;
          toast({ variant: "destructive", title: t("common.saveFailed") });
        },
      });
    },
    [save, t],
  );

  const assign = () => {
    if (pickedIds.length === 0) return;
    const existing = admins.map(toInput);
    const added = pickedIds
      .filter((id) => !existing.some((admin) => admin.user_id === id))
      .map((id) => ({
        user_id: id,
        can_manage_groups: canManageGroups,
        can_publish_announcements: canPublish,
      }));

    persist([...existing, ...added], () => {
      setPickedIds([]);
      setSearchInput("");
    });
  };

  const toggleFlag = useCallback(
    (
      admin: ForumAdmin,
      key: "can_manage_groups" | "can_publish_announcements",
    ) => {
      persist(
        admins.map((item) =>
          item.user_id === admin.user_id
            ? { ...toInput(item), [key]: !item[key] }
            : toInput(item),
        ),
      );
    },
    [admins, persist],
  );

  const remove = (admin: ForumAdmin) => {
    persist(
      admins.filter((item) => item.user_id !== admin.user_id).map(toInput),
      () => setPendingRemoval(null),
    );
  };

  const columns = useMemo(
    () => [
      {
        key: "name",
        name: t("common.employeeName"),
        sortable: false,
        minWidth: 200,
        render: (admin: ForumAdmin) => (
          <div className="flex flex-col py-1">
            <span className="text-sm font-medium">{admin.name}</span>
            <span className="text-xs text-muted-foreground">
              {[admin.employee_number, admin.job_title, admin.branch_name]
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
        minWidth: 130,
        render: () => (
          <StatusChip label={t("roles.forumAdmin")} tone="success" />
        ),
      },
      {
        key: "groups_count",
        name: t("common.groups"),
        sortable: false,
        minWidth: 110,
        render: (admin: ForumAdmin) => <span>{admin.groups_count ?? 0}</span>,
      },
      {
        key: "can_manage_groups",
        name: t("forum.admins.manageGroups"),
        sortable: false,
        minWidth: 160,
        render: (admin: ForumAdmin) => (
          <StatusChip
            label={
              admin.can_manage_groups
                ? t("common.enabled")
                : t("common.disabled")
            }
            tone={admin.can_manage_groups ? "success" : "muted"}
          />
        ),
      },
      {
        key: "can_publish_announcements",
        name: t("forum.admins.publishAnnouncements"),
        sortable: false,
        minWidth: 170,
        render: (admin: ForumAdmin) => (
          <StatusChip
            label={
              admin.can_publish_announcements
                ? t("common.enabled")
                : t("common.disabled")
            }
            tone={admin.can_publish_announcements ? "success" : "muted"}
          />
        ),
      },
      {
        key: "actions",
        name: t("common.actions"),
        sortable: false,
        align: "center" as const,
        minWidth: 120,
        render: (admin: ForumAdmin) => {
          if (!canEdit) return null;
          const actions: RowAction[] = [
            {
              key: "groups",
              label: t("forum.admins.toggleManageGroups"),
              icon: <LayoutGrid className="size-4" />,
              onSelect: () => toggleFlag(admin, "can_manage_groups"),
            },
            {
              key: "announcements",
              label: t("forum.admins.togglePublish"),
              icon: <ShieldCheck className="size-4" />,
              onSelect: () => toggleFlag(admin, "can_publish_announcements"),
            },
            {
              key: "remove",
              label: t("forum.admins.removeAdmin"),
              icon: <Trash2 className="size-4" />,
              destructive: true,
              onSelect: () => setPendingRemoval(admin),
            },
          ];
          return <RowActionsMenu actions={actions} />;
        },
      },
    ],
    [t, canEdit, toggleFlag],
  );

  const columnVisibility = Table.useColumnVisibility(columns);

  const tableState = Table.useTableState({
    data: admins,
    columns,
    totalPages: data?.pagination.last_page ?? 1,
    totalItems: data?.pagination.result_count ?? admins.length,
    params: tableParams,
    selectable: false,
    getRowId: (admin) => admin.user_id,
    loading: isLoading,
    searchable: false,
    filtered: false,
    columnVisibility,
  });

  return (
    <ForumShell
      forumId={forumId}
      active="admins"
      title={t("forum.admins.title")}
      breadcrumb={t("forum.admins.breadcrumb")}
    >
      <div className="flex flex-col gap-5">
        {isError ? <Alert severity="error">{t("common.loadFailed")}</Alert> : null}

        <Table
          filters={<Table.TopActions state={tableState} />}
          table={<Table.Table state={tableState} loadingOptions={{ rows: 4 }} />}
          pagination={
            <Table.Pagination
              state={tableState}
              pageSizeOptions={[10, 15, 25, 50]}
            />
          }
        />

        {canEdit ? (
          <div className="grid gap-5 lg:grid-cols-2">
            <SectionCard
              title={t("forum.admins.assignTitle")}
              hint={t("forum.admins.assignHint")}
            >
              <EmployeePicker
                search={searchInput}
                onSearchChange={setSearchInput}
                employees={(directory.data ?? []).filter(
                  (employee) =>
                    !admins.some((admin) => admin.user_id === employee.id),
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
                badgeLabel={t("roles.admin")}
                countLabel={t("wizard.admins.selected", {
                  count: pickedIds.length,
                })}
                footer={
                  <div className="flex flex-col gap-3">
                    {/* The design shows a role-scope select; the API models the
                        scope as the two permission flags below. */}
                    <InfoNote icon={<Info />}>
                      {t("wizard.admins.transferHint")}
                    </InfoNote>
                    <Button
                      onClick={assign}
                      loading={save.isPending}
                      disabled={pickedIds.length === 0}
                    >
                      <UserPlus />
                      {t("forum.admins.assign")}
                    </Button>
                  </div>
                }
              />
            </SectionCard>

            <SectionCard
              title={t("forum.admins.roleTitle")}
              hint={t("forum.admins.roleHint")}
            >
              <div className="flex flex-col gap-3">
                <SwitchRow
                  label={t("forum.admins.manageGroups")}
                  hint={t("forum.admins.manageGroupsHint")}
                  checked={canManageGroups}
                  onChange={setCanManageGroups}
                />
                <SwitchRow
                  label={t("forum.admins.supervision")}
                  hint={t("forum.admins.supervisionHint")}
                  checked={canPublish}
                  onChange={setCanPublish}
                />
                <InfoNote icon={<Info />}>
                  {t("forum.admins.roleScopeNote")}
                </InfoNote>
              </div>
            </SectionCard>
          </div>
        ) : null}
      </div>

      <ConfirmDialog
        open={Boolean(pendingRemoval)}
        title={t("forum.admins.removeAdmin")}
        body={t("forum.admins.removeConfirm")}
        confirmLabel={t("common.remove")}
        destructive
        loading={save.isPending}
        onConfirm={() => pendingRemoval && remove(pendingRemoval)}
        onClose={() => setPendingRemoval(null)}
      />
    </ForumShell>
  );
}
