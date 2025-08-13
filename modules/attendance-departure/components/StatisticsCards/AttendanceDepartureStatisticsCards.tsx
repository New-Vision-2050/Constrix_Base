import StatisticsCard from "./AttendanceDepartureStatisticsCard";
import { UserIcon, UsersIcon, ActivityIcon, TrendingUpIcon, Clock, Calendar } from "lucide-react";
import { useAttendance } from "../../context/AttendanceContext";
import { useTranslations } from "next-intl";

// Loading skeleton for cards
const LoadingSkeleton = () => (
  <div className="flex w-full min-h-[250px] items-center justify-between gap-4 overflow-x-auto whitespace-nowrap">
    {[...Array(4)].map((_, idx) => (
      <div key={idx} className="flex-1 min-w-[200px] h-[200px] bg-gray-100 animate-pulse rounded-lg"></div>
    ))}
  </div>
);

export default function AttendanceDepartureStatisticsCards() {
  const { attendanceSummary, attendanceSummaryLoading } = useAttendance();
  const t = useTranslations("AttendanceDepartureModule.StatisticsCards");

  // Show loading skeleton while data is being fetched
  if (attendanceSummaryLoading || !attendanceSummary) {
    return <LoadingSkeleton />;
  }

  // Calculate percentages
  const totalDays = attendanceSummary.total_days || 1; // Avoid division by zero

  // Dynamic card data based on attendance summary
  const cardsData = [
    {
      label: t("totalAttendance"),
      value: attendanceSummary.total_attendant,
      percentage: attendanceSummary.total_attendant_percentage,
      percentageColor: "#27C200",
      icon: <UserIcon size={24} color="#B39DDB" />,
    },
    {
      label: t("totalAbsence"),
      value: attendanceSummary.total_absent_days,
      percentage: attendanceSummary.total_absent_days_percentage,
      percentageColor: "#FF2D2D",
      icon: <UsersIcon size={24} color="#B39DDB" />,
    },
    {
      label: t("totalDepartures"),
      value: attendanceSummary.total_departures,
      percentage: attendanceSummary.total_departures_percentage,
      percentageColor: "#27C200",
      icon: <ActivityIcon size={24} color="#B39DDB" />,
    },
    {
      label: t("totalHolidays"),
      value: attendanceSummary.total_holiday_days,
      percentage: attendanceSummary.total_holiday_days_percentage,
      percentageColor: "#FF7A00",
      icon: <Calendar size={24} color="#6EC1E4" />,
    },
  ];

  return (
    <div className="flex w-full min-h-[250px] items-center justify-between gap-4 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {cardsData.map((card, index) => (
        <StatisticsCard
          key={index}
          label={card.label}
          value={card.value}
          percentage={card.percentage}
          percentageColor={card.percentageColor}
          icon={card.icon}
        />
      ))}
    </div>
  );
}
