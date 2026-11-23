"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { Alert } from "@mui/material";
import HeadlessTableLayout from "@/components/headless/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/modules/table/components/ui/input";
import ForumShell from "../components/ForumShell";
import FilterCard, { FilterField, SelectFilter } from "../../components/ui/FilterCard";
import ActivityDiffPanel from "./ActivityDiffPanel";
import { ACTIVITY_ACTIONS } from "../../api/activity";
import { useActivityList } from "../../hooks/use-reports";
import { useEmployeeSearch } from "../../hooks/use-lookups";
import { activityActionLabel } from "../../utils/labels";
import { formatDateTime } from "../../utils/format";
import type { ActivityRow } from "../../types";

const Table = HeadlessTableLayout<ActivityRow>("forum-activity");

export default function ForumActivityView({ forumId }: { forumId: string }) {
  const t = useTranslations("Forums");
  const locale = useLocale();

  const [action, setAction] = useState("");
  const [actorId, setActorId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const actors = useEmployeeSearch({});

  const tableParams = Table.useTableParams({ initialPage: 1, initialLimit: 10 });

  const params = useMemo(
    () => ({
      page: tableParams.page,
      per_page: tableParams.limit,
      action,
      actor_id: actorId,
      from,
      to,
    }),
    [tableParams.page, tableParams.limit, action, actorId, from, to],
  );

  const { data, isLoading, isError } = useActivityList(forumId, params);
  const rows = data?.items ?? [];

  const columns = useMemo(
    () => [
      {
        key: "action",
        name: t("forum.activity.columns.action"),
        sortable: false,
        minWidth: 180,
        render: (row: ActivityRow) => (
          <span className="text-sm font-medium">
            {activityActionLabel(row.action, row.action_label, t)}
          </span>
        ),
      },
      {
        key: "actor",
        name: t("forum.activity.columns.actor"),
        sortable: false,
        minWidth: 160,
        render: (row: ActivityRow) => (
          <span className="text-sm">{row.actor?.name ?? "—"}</span>
        ),
      },
      {
        key: "target",
        name: t("forum.activity.columns.target"),
        sortable: false,
        minWidth: 160,
        render: (row: ActivityRow) => (
          <span className="text-sm">{row.target_label || "—"}</span>
        ),
      },
      {
        key: "created_at",
        name: t("forum.activity.columns.createdAt"),
        sortable: false,
        minWidth: 170,
        render: (row: ActivityRow) => (
          <span className="text-sm">{formatDateTime(row.created_at, locale)}</span>
        ),
      },
      {
        key: "details",
        name: t("forum.activity.columns.details"),
        sortable: false,
        align: "center" as const,
        minWidth: 120,
        render: (row: ActivityRow) => {
          // Only rows that carry a before/after snapshot can be expanded.
          const hasDiff = Boolean(row.before || row.after);
          if (!hasDiff) return <span className="text-muted-foreground">—</span>;

          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setExpanded((current) => (current === row.id ? null : row.id))
              }
            >
              {t("forum.activity.detailsAction")}
              <ChevronDown
                className={expanded === row.id ? "rotate-180" : undefined}
              />
            </Button>
          );
        },
      },
    ],
    [t, locale, expanded],
  );

  const columnVisibility = Table.useColumnVisibility(columns);

  const tableState = Table.useTableState({
    data: rows,
    columns,
    totalPages: data?.pagination.last_page ?? 1,
    totalItems: data?.pagination.result_count ?? 0,
    params: tableParams,
    selectable: false,
    getRowId: (row) => row.id,
    loading: isLoading,
    searchable: false,
    filtered: Boolean(action || actorId || from || to),
    columnVisibility,
  });

  const expandedRow = rows.find((row) => row.id === expanded) ?? null;

  return (
    <ForumShell
      forumId={forumId}
      active="activity"
      title={t("forum.activity.title")}
      breadcrumb={t("forum.activity.breadcrumb")}
    >
      <div className="flex flex-col gap-5">
        <FilterCard>
          <SelectFilter
            label={t("forum.activity.filters.action")}
            value={action}
            onChange={(value) => {
              setAction(value);
              tableParams.setPage(1);
            }}
            allLabel={t("forum.activity.filters.allActions")}
            options={ACTIVITY_ACTIONS.map((value) => ({
              value,
              label: activityActionLabel(value, "", t),
            }))}
          />

          <SelectFilter
            label={t("forum.activity.filters.actor")}
            value={actorId}
            onChange={(value) => {
              setActorId(value);
              tableParams.setPage(1);
            }}
            allLabel={t("common.allOwners")}
            placeholder={t("forum.activity.filters.actorPlaceholder")}
            options={(actors.data ?? []).map((employee) => ({
              value: employee.id,
              label: employee.name,
            }))}
          />

          <FilterField label={t("forum.activity.filters.from")}>
            <Input
              className="h-9"
              type="date"
              value={from}
              onChange={(event) => {
                setFrom(event.target.value);
                tableParams.setPage(1);
              }}
            />
          </FilterField>

          <FilterField label={t("forum.activity.filters.to")}>
            <Input
              className="h-9"
              type="date"
              value={to}
              onChange={(event) => {
                setTo(event.target.value);
                tableParams.setPage(1);
              }}
            />
          </FilterField>
        </FilterCard>

        {isError ? <Alert severity="error">{t("common.loadFailed")}</Alert> : null}

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

        {expandedRow ? <ActivityDiffPanel row={expandedRow} /> : null}
      </div>
    </ForumShell>
  );
}
