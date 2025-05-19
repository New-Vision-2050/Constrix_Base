"use client";
import {
  BackpackIcon,
  ChartColumnStacked,
  MapPin,
  UserIcon,
} from "lucide-react";
import StatisticsCard, {
  CardInfoT,
  StatisticsCardInfo,
} from "./StatisticsCard";
import { useOrgStructureCxt } from "../context/OrgStructureCxt";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

export default function StatisticsCardsList() {
  const { widgets } = useOrgStructureCxt();
  const t = useTranslations("CompanyStructure.cards");

  const statisticsCardsList: CardInfoT[] = useMemo(() => {
    if (!widgets) return [];
    const usersTotal = calculateAchievementPercentage(
      widgets?.users?.total_users ?? 0,
      widgets?.users?.users_with_hierarchy ?? 0
    );
    const branchesTotal = calculateAchievementPercentage(
      widgets?.branches?.total_count ?? 0,
      widgets?.branches?.used_count ?? 0
    );
    const managementsTotal = calculateAchievementPercentage(
      widgets?.management?.total_count ?? 0,
      widgets?.management?.used_count ?? 0
    );
    const departmentsTotal = calculateAchievementPercentage(
      widgets?.departments?.total_count ?? 0,
      widgets?.departments?.used_count ?? 0
    );

    return [
      {
        number: widgets?.users?.total_users ?? 0,
        title: t("users.title"),
        description: t("users.subtitle"),
        icon: <UserIcon color="blue" />,
        progressBarValue: usersTotal,
        leftSideInfo: {
          count: String(widgets?.users?.users_with_hierarchy ?? 0),
          description: t("users.achievedStatement"),
        },
        rightSideInfo: {
          count: String(widgets?.users?.users_without_hierarchy ?? 0),
          description: t("users.reminderStatement"),
        },
      },
      {
        number: widgets?.branches?.total_count ?? 0,
        title: t("branches.title"),
        description: t("branches.subtitle"),
        icon: <MapPin color="green" />,
        progressBarValue: branchesTotal,
        leftSideInfo: {
          count: String(widgets?.branches?.used_count ?? 0),
          description: t("branches.achievedStatement"),
        },
        rightSideInfo: {
          count: String(widgets?.branches?.unused_count ?? 0),
          description: t("branches.reminderStatement"),
        },
      },
      {
        number: widgets?.management?.total_count ?? 0,
        title: t("managements.title"),
        description: t("managements.subtitle"),
        icon: <BackpackIcon color="pink" />,
        progressBarValue: managementsTotal,
        leftSideInfo: {
          count: String(widgets?.management?.used_count ?? 0),
          description: t("managements.achievedStatement"),
        },
        rightSideInfo: {
          count: String(widgets?.management?.unused_count ?? 0),
          description: t("managements.reminderStatement"),
        },
      },
      {
        number: widgets?.departments?.total_count ?? 0,
        title: t("departments.title"),
        description: t("departments.subtitle"),
        icon: <ChartColumnStacked color="orange" />,
        progressBarValue: departmentsTotal ?? 0,
        leftSideInfo: {
          count: String(widgets?.departments?.used_count ?? 0),
          description: t("departments.achievedStatement"),
        },
        rightSideInfo: {
          count: String(widgets?.departments?.unused_count ?? 0),
          description: t("departments.reminderStatement"),
        },
      },
    ];
  }, [widgets]);

  function calculateAchievementPercentage(
    total: number,
    completed: number
  ): number {
    if (total === 0) return 0;
    return (completed / total) * 100;
  }

  return (
    <div className="flex w-full min-h-[250px] items-center justify-between gap-4 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-4">
      {statisticsCardsList?.map((card, index) => (
        <StatisticsCard
          key={index}
          title={card.title}
          number={card.number}
          icon={card.icon}
          description={card.description}
          progressBarValue={card.progressBarValue}
          leftSideInfo={card.leftSideInfo as StatisticsCardInfo}
          rightSideInfo={card.rightSideInfo}
        />
      ))}
    </div>
  );
}
