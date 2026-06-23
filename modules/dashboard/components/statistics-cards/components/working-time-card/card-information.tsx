import { useTranslations } from "next-intl";
import { useUserDashboardCxt } from "@/modules/dashboard/context/user-dashboard-cxt";

export default function WorkingTimeCardInformation() {
  const t = useTranslations("UserProfile.header.statisticsCards");
  const { overview } = useUserDashboardCxt();

  const attendance = overview?.attendance;
  const hours = attendance?.worked?.hours ?? 0;
  const minutes = attendance?.worked?.minutes ?? 0;
  const percentageChange = attendance?.percentage_change ?? 0;
  const trend = attendance?.trend ?? "neutral";

  const trendColor =
    trend === "up"
      ? "text-green-700"
      : trend === "down"
      ? "text-red-500"
      : "text-gray-400";

  const dotColor =
    trend === "up"
      ? "bg-green-700"
      : trend === "down"
      ? "bg-red-500"
      : "bg-gray-400";

  const trendSign = trend === "up" ? "+" : trend === "down" ? "-" : "";

  return (
    <div className="flex min-w-0 flex-col justify-between gap-4 overflow-hidden">
      <div>
        <h2 className="text-sm font-semibold mb-1">{t("workingTime")}</h2>
        <p className="text-sm text-gray-500">{t("weeklyReport")}</p>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">
          {hours}<span>س</span> {minutes}
          <span>د</span>
        </h3>
        <div className="flex gap-1 items-center">
          <span className={`w-3 h-3 ${dotColor} rounded-full`} />
          <span className={`px-2 py-1 text-sm font-medium ${trendColor} rounded-md`}>
            {trendSign}{Math.abs(percentageChange)}%
          </span>
        </div>
      </div>
    </div>
  );
}
