import React from "react";
import HRStatisticsCard from "./HRStatisticsCard";
import { UserIcon, UsersIcon, ActivityIcon, TrendingUpIcon, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import useAttendanceSummary from "@/modules/attendance-departure/hooks/useAttendanceSummary";

/**
 * Container component for HR statistics cards
 */
const HRStatisticsCards: React.FC = () => {
  const t = useTranslations("hr-settings.statistics");
  
  // Get attendance summary data
  const {
    attendanceSummary,
    attendanceSummaryLoading,
    attendanceSummaryError,
    refetchAttendanceSummary
  } = useAttendanceSummary();
  
  // Show loading state
  if (attendanceSummaryLoading) {
    return (
      <div className="flex w-full min-h-[250px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">{t("loading")}</span>
      </div>
    );
  }
  
  // Show error state
  if (attendanceSummaryError) {
    return (
      <div className="flex w-full min-h-[250px] items-center justify-center text-red-500">
        <span>{t("error")}</span>
      </div>
    );
  }
  
  // Default values if data is not available
  const summary = attendanceSummary || {
    total_attendant: 0,
    total_attendant_percentage: 0,
    total_departures: 0,
    total_departures_percentage: 0,
    total_absent_days: 0,
    total_absent_days_percentage: 0,
    total_holiday_days: 0,
    total_holiday_days_percentage: 0
  };

  // HR statistics data for the cards with translations
  const cardsData = [
    {
      label: t("totalAttendance"),
      value: summary.total_attendant,
      percentage: summary.total_attendant_percentage,
      percentageColor: "#27C200",
      icon: <UserIcon size={24} color="#B39DDB" />,
    },
    {
      label: t("totalDeparture"),
      value: summary.total_departures,
      percentage: summary.total_departures_percentage,
      percentageColor: "#27C200",
      icon: <ActivityIcon size={24} color="#B39DDB" />,
    },
    {
      label: t("totalAbsence"),
      value: summary.total_absent_days,
      percentage: summary.total_absent_days_percentage,
      percentageColor: "#FF2D2D",
      icon: <UsersIcon size={24} color="#B39DDB" />,
    },
    {
      label: t("vacations"),
      value: summary.total_holiday_days,
      percentage: summary.total_holiday_days_percentage,
      percentageColor: "#FF7A00",
      icon: <TrendingUpIcon size={24} color="#6EC1E4" />,
    },
  ];

  // Render statistics cards
  return (
    <div className="flex w-full min-h-[250px] items-center justify-between gap-4 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {cardsData.map((card, idx) => (
        <HRStatisticsCard
          key={idx}
          label={card.label}
          value={card.value}
          percentage={card.percentage}
          percentageColor={card.percentageColor}
          icon={card.icon}
        />
      ))}
    </div>
  );
};

export default HRStatisticsCards;
