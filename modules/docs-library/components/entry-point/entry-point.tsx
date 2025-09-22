import { FileText } from "lucide-react";
import { StatisticsCardData } from "../statistics-cards/docs-company-statistics-card";
import CompanyDocsStatisticsCard from "../statistics-cards/docs-company-statistics-card/StatisticsCard";
import { ActivityStatisticsCard, ActivityStatisticsData } from "../statistics-cards/docs-statistics-by-activity";

const documentStats: StatisticsCardData = {
  title: "عدد المستندات الشركة",
  mainValue: 27,
  mainLabel: "مستند",
  secondaryValue: "160 MB",
  comparison: {
    leftValue: 120,
    leftLabel: "المساحة المتبقية",
    rightValue: 40,
    rightLabel: "المساحة المستهلكة",
    unit: "MB",
  },
  icon: <FileText className="w-6 h-6 text-blue-400" />,
};

const activityStats: ActivityStatisticsData = {
  items: [
    {
      title: 'المستندات السارية',
      percentage: 88,
      description: 'معدل المستندات السارية للشركة',
      color: '#10B981',
      icon: <FileText className="w-6 h-6 text-[#10B981]" />
    },
    {
      title: 'المستندات المنتهية',
      percentage: 60,
      description: 'معدل المستندات المنتهية للشركة',
      color: '#EC4899',
      icon: <FileText className="w-6 h-6 text-[#EC4899]" />
    }
  ]
};

export default function DocsLibraryEntryPoint() {
  return (
    <div className="space-y-4">
      <CompanyDocsStatisticsCard data={documentStats} />
      <ActivityStatisticsCard data={activityStats} />
      <ActivityStatisticsCard isLoading={true} />
      <ActivityStatisticsCard error="فشل في تحميل البيانات" />
    </div>
  );
}
