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
import { useDocsLibraryCxt } from "../../context/docs-library-cxt";
import { useMemo } from "react";

export default function DocsStatisticsCardsList() {
  // declare and define component vars
  const { docsWidgets } = useDocsLibraryCxt();
  const t = useTranslations("docs-library.statistics");

  const documentStats: StatisticsCardData = useMemo(
    () => ({
      title: t("documentStats.title"),
      mainValue: docsWidgets?.total_files_count ?? "-",
      mainLabel: t("documentStats.mainLabel"),
      secondaryValue: `${docsWidgets?.all_file_space ?? 0} MB`,
      comparison: {
        leftValue: docsWidgets?.all_remain_file_space ?? 0,
        leftLabel: t("documentStats.comparison.leftLabel"),
        rightValue: docsWidgets?.all_consumed_file_space ?? 0,
        rightLabel: t("documentStats.comparison.rightLabel"),
        unit: "MB",
      },
      icon: <FileText className="w-6 h-6 text-blue-400" />,
    }),
    [docsWidgets]
  );

  const activityStats: ActivityStatisticsData = useMemo(
    () => ({
      items: [
        {
          title: t("activityStats.title"),
          percentage: docsWidgets?.valid_files_percentage ?? 0,
          description: t("activityStats.description"),
          color: "#10B981",
          icon: <FileText className="w-6 h-6 text-[#10B981]" />,
        },
        {
          title: t("activityStats.title2"),
          percentage: docsWidgets?.expired_files_percentage ?? 0,
          description: t("activityStats.description2"),
          color: "#EC4899",
          icon: <FileText className="w-6 h-6 text-[#EC4899]" />,
        },
      ],
    }),
    [docsWidgets]
  );

  const expirationStats: ExpirationStatisticsData = useMemo(
    () => ({
      title: t("expirationStats.title"),
      totalCount: docsWidgets?.almost_expired_files_count ?? 0,
      countLabel: t("expirationStats.countLabel"),
      documents:
        docsWidgets?.almost_expired_files?.map((file) => ({
          id: file.id.toString(),
          name: file.name,
          expirationDate: "static date",
          icon: <FileText className="w-4 h-4  text-dark dark:text-white" />,
          badgeText: t("expirationStats.badgeText"),
          badgeVariant: "warning",
        })) ?? [],
    }),
    [docsWidgets]
  );

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
