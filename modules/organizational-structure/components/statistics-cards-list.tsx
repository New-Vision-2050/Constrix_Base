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

export default function StatisticsCardsList() {
  const { widgets } = useOrgStructureCxt();

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
        title: "مؤشر عدد الموظفين",
        description: "اجمالي عدد الموظفين",
        icon: <UserIcon color="pink" />,
        progressBarValue: usersTotal,
        leftSideInfo: {
          count: String(widgets?.users?.users_with_hierarchy ?? 0),
          description: "عدد الموظفين المستخدمة",
        },
        rightSideInfo: {
          count: String(widgets?.users?.users_without_hierarchy ?? 0),
          description: "عدد الموظفين المتبقية",
        },
      },
      {
        number: widgets?.branches?.total_count ?? 0,
        title: "مؤشر عدد الفروع",
        description: "اجمالي عدد الفروع",
        icon: <MapPin color="green" />,
        progressBarValue: branchesTotal,
        leftSideInfo: {
          count: String(widgets?.branches?.used_count ?? 0),
          description: "عدد الفروع المستخدمة",
        },
        rightSideInfo: {
          count: String(widgets?.branches?.unused_count ?? 0),
          description: "عدد الفروع المتبقية",
        },
      },
      {
        number: widgets?.management?.total_count ?? 0,
        title: "مؤشر عدد الادارات الرئيسية",
        description: "اجمالي عدد الادارات الرئيسية",
        icon: <BackpackIcon color="pink" />,
        progressBarValue: managementsTotal,
        leftSideInfo: {
          count: String(widgets?.management?.used_count ?? 0),
          description: "عدد الادارات الرئيسية المستخدمة",
        },
        rightSideInfo: {
          count: String(widgets?.management?.unused_count ?? 0),
          description: "عدد الادارات الرئيسية المتبقية",
        },
      },
      {
        number: widgets?.departments?.total_count ?? 0,
        title: "مؤشر عدد الادارات الفرعية",
        description: "اجمالي عدد الادارات الفرعية",
        icon: <ChartColumnStacked color="orange" />,
        progressBarValue: departmentsTotal ?? 0,
        leftSideInfo: {
          count: String(widgets?.departments?.used_count ?? 0),
          description: "عدد الادارات الفرعية المستخدمة",
        },
        rightSideInfo: {
          count: String(widgets?.departments?.unused_count ?? 0),
          description: "عدد الادارات الفرعية المتبقية",
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
