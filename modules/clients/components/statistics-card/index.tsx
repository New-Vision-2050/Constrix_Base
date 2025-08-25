import StatisticsCard from "@/components/shared/StatisticsCard";
import { UserIcon, UsersIcon, ActivityIcon, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

// Loading skeleton for cards
const LoadingSkeleton = () => (
  <div className="flex w-full min-h-[250px] items-center justify-between gap-4 overflow-x-auto whitespace-nowrap">
    {[...Array(4)].map((_, idx) => (
      <div key={idx} className="flex-1 min-w-[200px] h-[140px] bg-gray-100 animate-pulse rounded-lg"></div>
    ))}
  </div>
);

export default function ClientsStatisticsCards() {
    // TODO: Get clients summary data
    // from context

  const t = useTranslations("ClientsModule.StatisticsCards");

  // Show loading skeleton while data is being fetched
  if (false) {
    return <LoadingSkeleton />;
  }


  // Dynamic card data based on attendance summary
  const cardsData = [
    {
      label: t("totalClients"),
      value: 125,
      percentage: 18,
      percentageColor: "#27C200",
      icon: <UserIcon size={24} color="#B39DDB" />,
    },
    {
      label: t("totalClientsInLastMonth"),
      value: 125,
      percentage: 18,
      percentageColor: "#FF2D2D",
      icon: <UsersIcon size={24} color="#B39DDB" />,
    },
    {
      label: t("activeClients"),
      value: 125,
      percentage: 18,
      percentageColor: "#27C200",
      icon: <ActivityIcon size={24} color="#B39DDB" />,
    },
    {
      label: t("inactiveClients"),
      value: 125,
      percentage: 18,
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
