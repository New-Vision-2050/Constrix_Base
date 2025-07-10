import React from "react";

interface StatisticsCardProps {
  label: string;
  value: number | string;
  percentage?: number;
  icon: React.ReactNode;
  percentageColor?: string;
  backgroundColor?: string;
  iconBgColor?: string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  label,
  value,
  percentage,
  icon,
  percentageColor = "#27C200",
  backgroundColor = "#18123A",
  iconBgColor = "#2C254B",
}) => {
  return (
    <div
      style={{ background: backgroundColor }}
      className="flex items-center justify-between rounded-xl p-4 min-w-[270px] min-h-[110px]"
    >
      {/* icon */}
      <div
        className="flex items-center justify-center rounded-lg ml-4"
        style={{ background: iconBgColor, width: 40, height: 40 }}
      >
        {icon}
      </div>

      {/* label and value */}
      <div className="flex flex-col justify-center flex-1">
        <div className="text-lg text-gray-400 mb-1" style={{ fontWeight: 400 }}>
          {label}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-normal text-gray-100">{value}</span>
          {percentage !== undefined && (
            <span
              className="text-sm font-normal"
              style={{ color: percentageColor }}
            >
              ({percentage}%)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;
