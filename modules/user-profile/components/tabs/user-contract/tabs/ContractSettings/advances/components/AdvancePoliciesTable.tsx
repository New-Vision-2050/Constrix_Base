"use client";

import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { UserAdvancePolicy } from "../types";

const TRANSLATION_NAMESPACE =
  "UserProfile.tabs.contractTabs.contractSettings";

type Props = {
  rows: UserAdvancePolicy[];
  loading?: boolean;
};

/** Read-only table of the user's assigned advance policies + live availability. */
export default function AdvancePoliciesTable({ rows, loading = false }: Props) {
  const t = useTranslations(TRANSLATION_NAMESPACE);
  const locale = useLocale();
  const format = (value: number) => Number(value ?? 0).toLocaleString(locale);

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="h-12 animate-pulse rounded-lg bg-white/5" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        {t("noAdvancePolicies")}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-gray-700 bg-white/5 text-gray-300">
            <th className="px-4 py-3 text-start font-medium">{t("policyName")}</th>
            <th className="px-4 py-3 text-start font-medium">{t("advanceMaxAmount")}</th>
            <th className="px-4 py-3 text-start font-medium">
              {t("advanceMaxInstallments")}
            </th>
            <th className="px-4 py-3 text-start font-medium">{t("advanceActive")}</th>
            <th className="px-4 py-3 text-start font-medium">
              {t("advanceRemainingSlots")}
            </th>
            <th className="px-4 py-3 text-start font-medium">{t("advanceCanRequest")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const canRequest = Boolean(Number(row.can_request));
            return (
              <tr
                key={row.advance_policy_id}
                className="border-b border-gray-800 last:border-0 hover:bg-white/5"
              >
                <td className="px-4 py-3 font-medium">
                  <span className="flex items-center gap-2">
                    {row.name}
                    {Number(row.is_default) ? (
                      <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-gray-300">
                        {t("defaultBadge")}
                      </span>
                    ) : null}
                  </span>
                </td>
                <td className="px-4 py-3">{format(row.max_amount)}</td>
                <td className="px-4 py-3">{format(row.max_installments)}</td>
                <td className="px-4 py-3">
                  {format(row.active_count)} / {format(row.max_active_advances)}
                </td>
                <td className="px-4 py-3 font-semibold text-emerald-400">
                  {format(row.remaining_slots)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
                      canRequest
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-red-500/15 text-red-400",
                    )}
                  >
                    {canRequest ? t("advanceCanRequestYes") : t("advanceCanRequestNo")}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
