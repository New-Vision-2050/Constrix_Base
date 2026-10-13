"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import FormFieldSet from "../../../components/FormFieldSet";
import useUserLeavePolicies from "../hooks/useUserLeavePolicies";
import { LeaveBalanceTotals } from "../types";
import AssignLeavePoliciesSection from "./AssignLeavePoliciesSection";
import LeaveBalancesTable from "./LeaveBalancesTable";
import LeaveStatsCards from "./LeaveStatsCards";
import LeaveSummaryChart from "./LeaveSummaryChart";
import LeaveYearSelect from "./LeaveYearSelect";

const TRANSLATION_NAMESPACE =
  "UserProfile.tabs.contractTabs.contractSettings";

type Props = {
  userId: string;
};

/**
 * Leave policies section: summary stat widgets + consumed/remaining donut +
 * per-leave-type balances table (per selected year), plus the
 * assign-policies edit action.
 */
export default function LeaveBalancesPanel({ userId }: Props) {
  const t = useTranslations(TRANSLATION_NAMESPACE);
  const [year, setYear] = useState(() => new Date().getFullYear());

  const { data: rows = [], isLoading, isFetching } = useUserLeavePolicies(
    userId,
    year,
  );
  const loading = isLoading || isFetching;

  const totals = useMemo<LeaveBalanceTotals>(
    () =>
      rows.reduce<LeaveBalanceTotals>(
        (acc, row) => ({
          entitled: acc.entitled + (Number(row.entitled_days) || 0),
          used: acc.used + (Number(row.used_days) || 0),
          pending: acc.pending + (Number(row.pending_days) || 0),
          available: acc.available + (Number(row.available_days) || 0),
        }),
        { entitled: 0, used: 0, pending: 0, available: 0 },
      ),
    [rows],
  );

  return (
    <div className="flex flex-col gap-8">
      <FormFieldSet
        title={t("leaves")}
        secondTitle={
          <LeaveYearSelect
            year={year}
            onChange={setYear}
            className="w-[110px] bg-sidebar"
          />
        }
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
          <LeaveStatsCards totals={totals} loading={loading} />
          <LeaveSummaryChart
            used={totals.used}
            entitled={totals.entitled}
            loading={loading}
          />
        </div>
      </FormFieldSet>

      <FormFieldSet title={t("leaveTypes")}>
        <LeaveBalancesTable rows={rows} loading={loading} />
      </FormFieldSet>

      <FormFieldSet title={t("assignPolicies")}>
        <AssignLeavePoliciesSection
          userId={userId}
          year={year}
          assignedRows={rows}
          assignedLoading={isLoading}
        />
      </FormFieldSet>
    </div>
  );
}
