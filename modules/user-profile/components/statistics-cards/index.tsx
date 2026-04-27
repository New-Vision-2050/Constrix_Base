import ContractStatusCard from "@/modules/dashboard/components/statistics-cards/components/contract-status-card";
import FinancialReportCard from "@/modules/dashboard/components/statistics-cards/components/financial-report-card";
import TasksStatisticCard from "@/modules/dashboard/components/statistics-cards/components/tasks-statistic-card";
import WorkingTimeCard from "@/modules/dashboard/components/statistics-cards/components/working-time-card";
import { useUserProfileCxt } from "../../context/user-profile-cxt";
import useUserEmploymentContractData from "../tabs/user-contract/tabs/FunctionalAndContractualData/hooks/useUserEmploymentContractData";
import { useMemo } from "react";

function toDays(value: number, unitName: string): number {
  const unit = unitName.toLowerCase();
  if (unit.includes("شهر") || unit.includes("month")) return value * 30;
  if (unit.includes("سنه") || unit.includes("سنة") || unit.includes("year")) return value * 365;
  if (unit.includes("أسبوع") || unit.includes("week")) return value * 7;
  return value;
}

export default function StatisticsCardsSection() {
  const { widgetData, userId } = useUserProfileCxt();
  const { data: employmentContract } = useUserEmploymentContractData(userId ?? "");

  const contractWidgetData = useMemo(() => {
    if (!widgetData?.contract) return widgetData?.contract;

    const startDate = employmentContract?.start_date || widgetData.contract.start_date;
    let endDate = widgetData.contract.end_date;

    // Always recalculate end date from start_date + contract_duration when available
    if (employmentContract?.contract_duration && startDate) {
      const start = new Date(startDate);
      if (!isNaN(start.getTime())) {
        const durationNum = Number(employmentContract.contract_duration);
        if (durationNum > 0) {
          const end = new Date(start);
          const unitName = (employmentContract.contract_duration_unit?.name ?? "").toLowerCase();
          if (unitName.includes("شهر") || unitName.includes("month")) {
            end.setMonth(end.getMonth() + durationNum);
          } else if (unitName.includes("سنه") || unitName.includes("سنة") || unitName.includes("year")) {
            end.setFullYear(end.getFullYear() + durationNum);
          } else if (unitName.includes("أسبوع") || unitName.includes("week")) {
            end.setDate(end.getDate() + durationNum * 7);
          } else {
            end.setDate(end.getDate() + durationNum);
          }
          endDate = end.toISOString().split("T")[0];
        }
      }
    }

    const trialDays =
      employmentContract?.probation_period && employmentContract?.probation_period_unit
        ? toDays(Number(employmentContract.probation_period), employmentContract.probation_period_unit.name ?? "")
        : 0;

    const noticeDays =
      employmentContract?.notice_period && employmentContract?.notice_period_unit
        ? toDays(Number(employmentContract.notice_period), employmentContract.notice_period_unit.name ?? "")
        : 0;

    return {
      ...widgetData.contract,
      start_date: startDate,
      end_date: endDate,
      trial_period_days: trialDays,
      notice_period_days: noticeDays,
    };
  }, [widgetData?.contract, employmentContract]);

  return (
    <div className="flex w-full min-h-[250px] items-center justify-between gap-4 overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-4">
      <ContractStatusCard contractData={contractWidgetData} />
      <WorkingTimeCard />
      <FinancialReportCard />
      <TasksStatisticCard />

      {/* 
      <EmptyStatisticsCard
        title="حالة العقد"
        description="لا يوجد عقود حالية"
      /> 
      <EmptyStatisticsCard title="وقت الدوام" description="لا يوجد بيانات" />
      
      <EmptyStatisticsCard
        title="التقرير المالي"
        description="لا يوجد بيانات"
      />
      <EmptyStatisticsCard title="المهام" description="لا يوجد بيانات" />
       */}
    </div>
  );
}
