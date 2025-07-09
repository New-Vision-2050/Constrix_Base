import React from "react";
import HRStatisticsCard from "./HRStatisticsCard";
import { UserIcon, UsersIcon, ActivityIcon, TrendingUpIcon } from "lucide-react";

/**
 * HR statistics data for the cards
 */
const cardsData = [
  {
    label: "إجمالي عدد الحضور",
    value: 900,
    percentage: 90,
    percentageColor: "#27C200",
    icon: <UserIcon size={24} color="#B39DDB" />,
  },
  {
    label: "إجمالي عدد الانصراف",
    value: 90,
    percentage: 10,
    percentageColor: "#27C200",
    icon: <ActivityIcon size={24} color="#B39DDB" />,
  },
  {
    label: "إجمالي عدد الغياب",
    value: 50,
    percentage: 5,
    percentageColor: "#FF2D2D",
    icon: <UsersIcon size={24} color="#B39DDB" />,
  },
  {
    label: "الإجازات",
    value: 50,
    percentage: 5,
    percentageColor: "#FF2D2D",
    icon: <TrendingUpIcon size={24} color="#6EC1E4" />,
  },
];

/**
 * Container component for HR statistics cards
 */
const HRStatisticsCards: React.FC = () => {
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
