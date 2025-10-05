import { FileText } from "lucide-react";
import { StatisticsCardData } from "../statistics-cards/docs-company-statistics-card";
import CompanyDocsStatisticsCard from "../statistics-cards/docs-company-statistics-card/StatisticsCard";
import {
  ActivityStatisticsCard,
  ActivityStatisticsData,
} from "../statistics-cards/docs-statistics-by-activity";
import {
  ExpirationStatisticsCard,
  ExpirationStatisticsData,
} from "../statistics-cards/docs-statistics-by-expiration";

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
      title: "المستندات السارية",
      percentage: 88,
      description: "معدل المستندات السارية للشركة",
      color: "#10B981",
      icon: <FileText className="w-6 h-6 text-[#10B981]" />,
    },
    {
      title: "المستندات المنتهية",
      percentage: 60,
      description: "معدل المستندات المنتهية للشركة",
      color: "#EC4899",
      icon: <FileText className="w-6 h-6 text-[#EC4899]" />,
    },
  ],
};

const expirationStats: ExpirationStatisticsData = {
  title: "المستندات المقتربة على الانتهاء",
  totalCount: 14,
  countLabel: "عدد تحميلات المستند",
  documents: [
    {
      id: "1",
      name: "عقد_تحويل_21",
      expirationDate: "20/04/2024",
      icon: <FileText className="w-4 h-4  text-dark dark:text-white" />,
      badgeText: "تنتهي قريباً",
      badgeVariant: "warning",
    },
    {
      id: "2",
      name: "تحويلات_2",
      expirationDate: "20/04/2024",
      icon: <FileText className="w-4 h-4  text-dark dark:text-white" />,
      badgeText: "تنتهي قريباً",
      badgeVariant: "warning",
    },
  ],
};

export default function DocsStatisticsCardsList() {
  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between min-w-max">
        <CompanyDocsStatisticsCard
          data={documentStats}
          isLoading={false}
          error={undefined}
        />
        <ActivityStatisticsCard
          data={activityStats}
          isLoading={false}
          error={undefined}
        />
        <ExpirationStatisticsCard
          data={expirationStats}
          isLoading={false}
          error={undefined}
        />
      </div>
    </div>
  );
}
