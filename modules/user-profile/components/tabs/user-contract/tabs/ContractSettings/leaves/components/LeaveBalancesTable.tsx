"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { UserLeavePolicyBalance } from "../types";

const TRANSLATION_NAMESPACE =
  "UserProfile.tabs.contractTabs.contractSettings";

type Props = {
  rows: UserLeavePolicyBalance[];
  loading?: boolean;
};

type LeaveTypeRow = {
  leaveTypeKey: string;
  leaveTypeName: string;
  entitled: number;
  used: number;
  available: number;
};

/**
 * Read-only balances table: one row per leave type (policies sharing a type
 * are summed) for the selected year — نوع الإجازة / الإجمالي / المستخدم /
 * المتبقي.
 */
export default function LeaveBalancesTable({ rows, loading = false }: Props) {
  const t = useTranslations(TRANSLATION_NAMESPACE);
  const locale = useLocale();

  const typeRows = useMemo<LeaveTypeRow[]>(() => {
    const byType = new Map<string, LeaveTypeRow>();
    rows.forEach((row) => {
      const key = row.leave_type_id || row.leave_type_name || row.name;
      const existing = byType.get(key);
      if (existing) {
        existing.entitled += Number(row.entitled_days) || 0;
        existing.used += Number(row.used_days) || 0;
        existing.available += Number(row.available_days) || 0;
      } else {
        byType.set(key, {
          leaveTypeKey: key,
          leaveTypeName: row.leave_type_name || row.name,
          entitled: Number(row.entitled_days) || 0,
          used: Number(row.used_days) || 0,
          available: Number(row.available_days) || 0,
        });
      }
    });
    return Array.from(byType.values());
  }, [rows]);

  const formatNumber = (value: number) =>
    Number(value).toLocaleString(locale);

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="h-12 animate-pulse rounded-lg bg-white/5"
          />
        ))}
      </div>
    );
  }

  if (typeRows.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        {t("noBalances")}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="border-b border-gray-700 bg-white/5 text-gray-300">
            <th className="px-4 py-3 text-start font-medium">
              {t("leaveType")}
            </th>
            <th className="px-4 py-3 text-start font-medium">{t("total")}</th>
            <th className="px-4 py-3 text-start font-medium">{t("used")}</th>
            <th className="px-4 py-3 text-start font-medium">
              {t("remaining")}
            </th>
          </tr>
        </thead>
        <tbody>
          {typeRows.map((row) => (
            <tr
              key={row.leaveTypeKey}
              className="border-b border-gray-800 last:border-0 hover:bg-white/5"
            >
              <td className="px-4 py-3 font-medium">{row.leaveTypeName}</td>
              <td className="px-4 py-3">{formatNumber(row.entitled)}</td>
              <td className="px-4 py-3 font-semibold text-red-400">
                {formatNumber(row.used)}
              </td>
              <td className="px-4 py-3 font-semibold text-emerald-400">
                {formatNumber(row.available)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
