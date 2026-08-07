import React from "react";
import workerImg from "@/assets/images/worker-beard-short.png";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useUserDashboardCxt } from "@/modules/dashboard/context/user-dashboard-cxt";
import { ProfileWidgetTasksData } from "@/modules/user-profile/types/profile-widgets";

type Props = {
  tasksData?: ProfileWidgetTasksData;
};

export default function TasksStatisticCard({ tasksData }: Props = {}) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations("UserProfile.header.statisticsCards");
  const { overview } = useUserDashboardCxt();

  const monthName = new Date().toLocaleString(locale === "ar" ? "ar-SA" : "en-US", { month: "long" });

  if (tasksData) {
    const { total_count, accepted_count, accepted_percentage } = tasksData;
    const clampedPct = Math.min(100, Math.max(0, accepted_percentage));

    return (
      <div className="relative min-h-[177px] min-w-[250px] w-[250px] flex-shrink-0 overflow-hidden bg-sidebar shadow-md rounded-lg p-4 flex justify-between">
        <div className="flex flex-col justify-between gap-5 w-full">
          <div className="flex flex-col items-start gap-2">
            <h3 className="text-lg font-bold">{t("tasks")}</h3>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-pink-300">
              {monthName}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {accepted_count}
            </h2>
            <span className="text-sm text-gray-500">/ {total_count}</span>
          </div>
          <div className="w-full">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{accepted_percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-400 rounded-full transition-all duration-300"
                style={{ width: `${clampedPct}%` }}
              />
            </div>
          </div>
        </div>
        <img
          src={workerImg.src}
          alt="card image"
          className={`absolute bottom-0 ${
            isRtl ? "left-5" : "right-5"
          } h-[130px] w-auto`}
        />
      </div>
    );
  }

  const tasks = overview?.tasks;
  const count = tasks?.count ?? 0;
  const percentageChange = tasks?.percentage_change ?? 0;
  const trend = tasks?.trend ?? "neutral";

  const trendColor =
    trend === "up"
      ? "text-green-600"
      : trend === "down"
      ? "text-red-500"
      : "text-gray-400";

  const trendSign = trend === "up" ? "+" : trend === "down" ? "-" : "";

  return (
    <div className="relative min-h-[177px] min-w-[250px] w-[250px] flex-shrink-0 overflow-hidden bg-sidebar shadow-md rounded-lg p-4 flex justify-between">
      <div className="flex flex-col justify-between gap-5 w-full">
        <div className="flex flex-col items-start gap-2">
          <h3 className="text-lg font-bold">{t("tasks")}</h3>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full bg-pink-300`}
          >
            {monthName}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {count}
          </h2>
          <span className={`text-sm font-medium ${trendColor}`}>
            {trendSign}{Math.abs(percentageChange)}%
          </span>
        </div>
      </div>
      <img
        src={workerImg.src}
        alt="card image"
        className={`absolute bottom-0 ${
          isRtl ? "left-5" : "right-5"
        } h-[130px] w-auto`}
      />
    </div>
  );
}
