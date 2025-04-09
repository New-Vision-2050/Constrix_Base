import ContractStatusCard from "./components/contract-status-card";
import EmptyStatisticsCard from "./components/empty-card";
import FinancialReportCard from "./components/financial-report-card";
import TasksStatisticCard from "./components/tasks-statistic-card";
import WorkingTimeCard from "./components/working-time-card";

export default function StatisticsCardsSection() {
  return (
    <div className="flex w-full min-h-[250px] items-center justify-between gap-4 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-4">
      <ContractStatusCard />
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
