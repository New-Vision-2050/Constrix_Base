import { BackpackIcon, ChartColumnStacked, MapPin, UserIcon } from "lucide-react";
import StatisticsCard from "./StatisticsCard";

export default function StatisticsCardsList() {
  const statisticsCardsList = [
    {
      number: "120",
      title: "مؤشر عدد الموظفين",
      description: "اجمالي عدد الموظفين",
      icon: <UserIcon color="pink" />,
      progressBarValue: 85,
      leftSideInfo: { count: "115", description: "عدد الموظفين المستخدمة" },
      rightSideInfo: { count: "5", description: "عدد الموظفين المتبقية" },
    },
    {
      number: "10",
      title: "مؤشر عدد الفروع",
      description: "اجمالي عدد الفروع",
      icon: <MapPin color="green" />,
      progressBarValue: 80,
      leftSideInfo: { count: "8", description: "عدد الفروع المستخدمة" },
      rightSideInfo: { count: "2", description: "عدد الفروع المتبقية" },
    },
    {
      number: "120",
      title: "مؤشر عدد الادارات الرئيسية",
      description: "اجمالي عدد الادارات الرئيسية",
      icon: <BackpackIcon color="pink" />,
      progressBarValue: 40,
      leftSideInfo: {
        count: "40",
        description: "عدد الادارات الرئيسية المستخدمة",
      },
      rightSideInfo: {
        count: "80",
        description: "عدد الادارات الرئيسية المتبقية",
      },
    },
    {
      number: "40",
      title: "مؤشر عدد الادارات الفرعية",
      description: "اجمالي عدد الادارات الفرعية",
      icon: <ChartColumnStacked color="orange" />,
      progressBarValue: 50,
      leftSideInfo: {
        count: "20",
        description: "عدد الادارات الفرعية المستخدمة",
      },
      rightSideInfo: {
        count: "20",
        description: "عدد الادارات الفرعية المتبقية",
      },
    },
  ];

  return (
    <div className="flex w-full min-h-[250px] items-center justify-between gap-4 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-4">
      {statisticsCardsList?.map((card, index) => (
        <StatisticsCard key={index} {...card} />
      ))}
    </div>
  );
}
