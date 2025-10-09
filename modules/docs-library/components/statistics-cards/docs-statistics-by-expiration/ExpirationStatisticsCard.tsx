import React from "react";
import { ExpirationStatisticsCardProps } from "./types";
import DocumentItem from "./DocumentItem";
import ExpirationBadge from "./ExpirationBadge";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import { useTranslations } from "next-intl";

/**
 * ExpirationStatisticsCard component for displaying documents by expiration
 * Reusable card component with loading and error states
 * Follows SOLID principles with single responsibility
 */
const ExpirationStatisticsCard: React.FC<ExpirationStatisticsCardProps> = ({
  data,
  isLoading = false,
  error,
  className = "",
}) => {
  const t = useTranslations("docs-library.cards");

  console.log("data10505", data);
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
    return <ErrorState message={t("noData")} />;
  }

  const { title, totalCount, countLabel, documents } = data;

  return (
    <div
      className={`bg-sidebar w-[370px] min-h-[330px] m-2 rounded-2xl p-6  text-dark dark:text-white ${className}`}
    >
      {/* Header with title and count */}
      <div className="flex flex-col gap-2 mb-6">
        {/* Title */}
        <h3 className="text-lg font-semibold text-right">{title}</h3>
        {/* Count and badge */}
        <div className="flex items-center justify-between">
          {/* Count */}
          <div className="flex items-center gap-2 text-right">
            <span className="text-2xl font-bold">{totalCount}</span>
            <span className="text-sm text-gray-500 dark:text-gray-300">
              {countLabel}
            </span>
          </div>
          {/* Badge for expires soon */}
          <div className="mb-4">
            <ExpirationBadge text="تنتهي قريباً" variant="primary" />
          </div>
        </div>
      </div>

      {/* Documents list */}
      <div className="space-y-2 overflow-y-auto max-h-[190px] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
        {documents.map((document) => (
          <DocumentItem
            key={document.id}
            document={document}
            showBadge={false}
          />
        ))}
      </div>
    </div>
  );
};

export default ExpirationStatisticsCard;
