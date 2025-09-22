import React from "react";
import { ActivityStatisticsCardProps } from "./types";
import CircularProgress from "./CircularProgress";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

/**
 * ActivityStatisticsCard component for displaying document statistics by activity
 * Reusable card component with circular progress indicators
 * Follows SOLID principles with single responsibility
 */
const ActivityStatisticsCard: React.FC<ActivityStatisticsCardProps> = ({
  data,
  isLoading = false,
  error,
  className = "",
}) => {
  // Handle loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Handle error state
  if (error) {
    return <ErrorState message={error} />;
  }

  // Handle missing data
  if (!data || !data.items || data.items.length === 0) {
    return <ErrorState message="لا توجد بيانات للعرض" />;
  }

  return (
    <div
      className={`bg-sidebar w-[370px] min-h-[330px]  m-2 rounded-2xl p-6 text-white ${className}`}
    >
      <div className="space-y-6">
        {data.items.map((item, index) => (
          <div key={index}>
            <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
            <div className="flex items-center gap-4">
              {/* Circular progress indicator */}
              <CircularProgress
                percentage={item.percentage}
                color={item.color}
                size={80}
                strokeWidth={6}
                icon={item.icon}
              />

              {/* Text content */}
              <div className="text-right">
                <h3 className="text-lg font-semibold mb-1">
                  {Math.round(item.percentage)}%
                </h3>

                <p className="text-gray-300 text-sm">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityStatisticsCard;
