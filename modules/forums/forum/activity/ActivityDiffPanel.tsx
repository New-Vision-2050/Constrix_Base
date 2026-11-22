"use client";

import { useLocale, useTranslations } from "next-intl";
import SectionCard from "../../components/ui/SectionCard";
import { activityActionLabel } from "../../utils/labels";
import { formatDateTime, formatNumber } from "../../utils/format";
import type { ActivityRow } from "../../types";

/**
 * The «قبل التعديل / بعد التعديل» panel of the activity log. `before` and
 * `after` are free-form maps, so every key present in either side is listed and
 * the field name is translated when the module knows it.
 */
export default function ActivityDiffPanel({ row }: { row: ActivityRow }) {
  const t = useTranslations("Forums");
  const locale = useLocale();

  const keys = Array.from(
    new Set([
      ...Object.keys(row.before ?? {}),
      ...Object.keys(row.after ?? {}),
    ]),
  );

  const fieldLabel = (key: string) => {
    const path = `forum.activity.fields.${key}`;
    return t.has(path) ? t(path) : key;
  };

  const render = (value: unknown): string => {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "boolean") {
      return value ? t("common.enabled") : t("common.disabled");
    }
    if (typeof value === "number") return formatNumber(value, locale);
    if (Array.isArray(value)) {
      return value.length > 0
        ? value.map((item) => render(item)).join("، ")
        : "—";
    }
    if (typeof value === "object") {
      const named = value as { name?: string; label?: string };
      return named.name ?? named.label ?? JSON.stringify(value);
    }
    const text = String(value);
    // Sending modes and statuses come back as enum keys.
    const enumPath = `sendPermission.${text}`;
    return t.has(enumPath) ? t(enumPath) : text;
  };

  return (
    <SectionCard
      title={activityActionLabel(row.action, row.action_label, t)}
      hint={`${row.target_label || "—"} · ${formatDateTime(row.created_at, locale)}`}
    >
      {keys.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("common.noData")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <DiffColumn
            title={t("forum.activity.before")}
            keys={keys}
            source={row.before}
            fieldLabel={fieldLabel}
            render={render}
          />
          <DiffColumn
            title={t("forum.activity.after")}
            keys={keys}
            source={row.after}
            fieldLabel={fieldLabel}
            render={render}
            highlight
          />
        </div>
      )}
    </SectionCard>
  );
}

function DiffColumn({
  title,
  keys,
  source,
  fieldLabel,
  render,
  highlight,
}: {
  title: string;
  keys: string[];
  source: Record<string, unknown> | null;
  fieldLabel: (key: string) => string;
  render: (value: unknown) => string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? "flex flex-col gap-3 rounded-lg border border-primary/40 bg-primary/5 p-4"
          : "flex flex-col gap-3 rounded-lg border border-border bg-background/40 p-4"
      }
    >
      <span className="text-sm font-medium text-foreground">{title}</span>
      <div className="flex flex-col gap-2">
        {keys.map((key) => (
          <div key={key} className="flex items-start justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              {fieldLabel(key)}
            </span>
            <span className="text-xs text-foreground">
              {render(source?.[key])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
