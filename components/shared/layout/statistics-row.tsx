import ArrowStaticIcon from "@/public/icons/arrow-static";
import ChartStaticIcon from "@/public/icons/chart-static";
import CheckStatic from "@/public/icons/check-static";
import PersonStaticIcon from "@/public/icons/person-static";

const statistics = [
  {
    title: "إجمالي الشركات",
    value: 1459,
    change: 18,
    icon: <PersonStaticIcon />,
  },
  { title: "الشركات الفعالة", value: 127, change: -14, icon: <CheckStatic /> },
  {
    title: "شركات غير مكتملة البيانات",
    value: 2,
    change: 18,
    icon: <ChartStaticIcon />,
  },
  {
    title: "شركات قاربت على الانتهاء",
    value: 127,
    change: -14,
    icon: <ArrowStaticIcon />,
  },
];

const StatisticsRow = () => {
  return (
    <div className="w-full grid grid-cols-4 gap-6">
      {statistics.map((stat, index) => (
        <div
          key={index}
          className="bg-sidebar gap-4 items-start w-full text-white py-6 px-5 rounded-lg flex shadow-md"
        >
          <div>{stat.icon}</div>
          <div className="flex flex-col">
            <h3 className="text-xs text-[#EAEAFFDE]">{stat.title}</h3>
            <div className="flex gap-3 items-center mt-1">
              <p className="text-2xl leading-none font-bold">{stat.value}</p>
              <span
                dir="ltr"
                className={`text-lg font-semibold ${
                  stat.change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                ({stat.change > 0 && "+"}
                {stat.change}%)
              </span>
            </div>{" "}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsRow;
