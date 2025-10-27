"use client";
import UserProfileActivityTimeline from "@/modules/dashboard/components/activity-timeline";
import ActivitiesLogsSearchFields from "./SearchFields";
import { Pagination } from "@/components/shared/Pagination";
import { useActivitiesLogsCxt } from "../context/ActivitiesLogsCxt";
import ActivityTimelineLoadingSkeleton from "@/modules/dashboard/components/activity-timeline/loading-skeleton";
import UserLogsTimeLine from "./UserLogsTimeLine";

export default function ActivitiesLogsEntryPoint() {
  const {
    activitiesLogs,
    activitiesLogsLoading,
    limit,
    handleLimitChange,
    searchFields,
    handleSearchFieldsChange,
  } = useActivitiesLogsCxt();

  return (
    <>
      {/* search fields */}
      <ActivitiesLogsSearchFields
        data={searchFields}
        onChange={handleSearchFieldsChange}
        isLoading={false}
      />

      {/*  user profile activity timeline */}
      <UserLogsTimeLine
        isLoading={activitiesLogsLoading}
        daysActivities={activitiesLogs}
      />

      {/* Pagination component */}
      <div className="mt-8 flex justify-center w-full">
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={() => {}}
          currentLimit={limit}
          hidePagination={true}
          limitOptions={[10, 25, 50, 100,500]}
          onLimitChange={handleLimitChange}
        />
      </div>
    </>
  );
}
