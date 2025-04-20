import ContractStatusCard from "@/modules/dashboard/components/statistics-cards/components/contract-status-card";
import FinancialReportCard from "@/modules/dashboard/components/statistics-cards/components/financial-report-card";
import TasksStatisticCard from "@/modules/dashboard/components/statistics-cards/components/tasks-statistic-card";
import WorkingTimeCard from "@/modules/dashboard/components/statistics-cards/components/working-time-card";
import { useUserProfileCxt } from "../../context/user-profile-cxt";

export default function StatisticsCardsSection() {
  const { widgetData } = useUserProfileCxt();
  return (
    <div className="flex w-full min-h-[250px] items-center justify-between gap-4 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-4">
      <ContractStatusCard contractData={widgetData?.contract} />
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
