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
import { useTranslations } from "next-intl";

export default function DocsStatisticsCardsList() {
  // declare and define component vars
  const t = useTranslations("docs-library.statistics");
  const documentStats: StatisticsCardData = {
    title: t("documentStats.title"),
    mainValue: 27,
    mainLabel: t("documentStats.mainLabel"),
    secondaryValue: "160 MB",
    comparison: {
      leftValue: 120,
      leftLabel: t("documentStats.comparison.leftLabel"),
      rightValue: 40,
      rightLabel: t("documentStats.comparison.rightLabel"),
      unit: "MB",
    },
    icon: <FileText className="w-6 h-6 text-blue-400" />,
  };

  const activityStats: ActivityStatisticsData = {
    items: [
      {
        title: t("activityStats.title"),
        percentage: 88,
        description: t("activityStats.description"),
        color: "#10B981",
        icon: <FileText className="w-6 h-6 text-[#10B981]" />,
      },
      {
        title: t("activityStats.title2"),
        percentage: 60,
        description: t("activityStats.description2"),
        color: "#EC4899",
        icon: <FileText className="w-6 h-6 text-[#EC4899]" />,
      },
    ],
  };

  const expirationStats: ExpirationStatisticsData = {
    title: t("expirationStats.title"),
    totalCount: 14,
    countLabel: t("expirationStats.countLabel"),
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

  // return component ui
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
