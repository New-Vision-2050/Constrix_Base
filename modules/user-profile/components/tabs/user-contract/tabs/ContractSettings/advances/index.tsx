"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import FormFieldSet from "../../components/FormFieldSet";
import { useUserAdvancePolicies } from "./hooks";
import { AdvanceTotals } from "./types";
import AdvanceStatsCards from "./components/AdvanceStatsCards";
import AdvancePoliciesTable from "./components/AdvancePoliciesTable";
import AssignAdvancePoliciesSection from "./components/AssignAdvancePoliciesSection";

/**
 * "السلف" tab (user profile → contract settings): live availability summary,
 * the user's assigned advance policies, and the assign-policies action.
 */
export default function AdvancesTab({ userId }: { userId: string }) {
  const t = useTranslations("UserProfile.tabs.contractTabs.contractSettings");
  const { data: rows = [], isLoading, isFetching } = useUserAdvancePolicies(userId);
  const loading = isLoading || isFetching;

  const totals = useMemo<AdvanceTotals>(
    () =>
      rows.reduce<AdvanceTotals>(
        (acc, row) => ({
          activeCount: acc.activeCount + (Number(row.active_count) || 0),
          pendingAmount: acc.pendingAmount + (Number(row.pending_amount) || 0),
          activeAmount: acc.activeAmount + (Number(row.active_amount) || 0),
          remainingSlots: acc.remainingSlots + (Number(row.remaining_slots) || 0),
        }),
        { activeCount: 0, pendingAmount: 0, activeAmount: 0, remainingSlots: 0 },
      ),
    [rows],
  );

  return (
    <div className="flex flex-col gap-8">
      <FormFieldSet title={t("advances")}>
        <AdvanceStatsCards totals={totals} loading={loading} />
      </FormFieldSet>

      <FormFieldSet title={t("advancePolicies")}>
        <AdvancePoliciesTable rows={rows} loading={loading} />
      </FormFieldSet>

      <FormFieldSet title={t("assignAdvancePolicies")}>
        <AssignAdvancePoliciesSection
          userId={userId}
          assignedRows={rows}
          assignedLoading={isLoading}
        />
      </FormFieldSet>
    </div>
  );
}
