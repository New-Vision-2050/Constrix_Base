import React from "react";
import { StatisticsCardProps } from "./types";
import ComparisonSection from "./ComparisonSection";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

/**
 * StatisticsCard component for displaying document statistics
 * Reusable card component with loading and error states
 * Follows SOLID principles with single responsibility
 */
const CompanyDocsStatisticsCard: React.FC<StatisticsCardProps> = ({
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
  if (!data) {
    return <ErrorState message="لا توجد بيانات للعرض" />;
  }

  const { title, mainValue, mainLabel, secondaryValue, comparison, icon } =
    data;

  return (
    <div
      className={`bg-sidebar w-[370px] min-h-[280px]  m-2 rounded-2xl p-6 text-white shadow-lg ${className}`}
    >
      {/* Header with title and icon */}
      <div className="flex items-center gap-2 mb-6">
        {icon && (
          <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-right">{title}</h3>
      </div>

      <div className="flex items-center mb-6 justify-between">
        {/* Main value display */}
        <div className="text-right mb-2 flex items-end gap-2">
          <div className="text-4xl font-bold mb-1">{mainValue}</div>
          {mainLabel && (
            <div className="text-sm text-gray-300">{mainLabel}</div>
          )}
        </div>

        {/* Secondary value (e.g., storage size) */}
        {secondaryValue && (
          <div className="mb-6">
            <span className="bg-gray-700/50 px-3 py-1 rounded-full text-sm">
              {secondaryValue}
            </span>
          </div>
        )}
      </div>

      {/* Comparison section */}
      {comparison && <ComparisonSection data={comparison} />}
    </div>
  );
};

export default CompanyDocsStatisticsCard;
