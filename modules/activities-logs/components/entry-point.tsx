"use client";
import UserProfileActivityTimeline from "@/modules/dashboard/components/activity-timeline";
import ActivitiesLogsSearchFields from "./SearchFields";
import { LOGS_ACTIVITIES } from "./dummy-data";
import { Pagination } from "@/components/shared/Pagination";
import { useActivitiesLogsCxt } from "../context/ActivitiesLogsCxt";
import ActivityTimelineLoadingSkeleton from "@/modules/dashboard/components/activity-timeline/loading-skeleton";

export default function ActivitiesLogsEntryPoint() {
  const { activitiesLogs, activitiesLogsLoading, limit, handleLimitChange } =
    useActivitiesLogsCxt();
  return (
    <>
      {/* search fields */}
      <ActivitiesLogsSearchFields
        data={{}}
        onChange={() => {}}
        isLoading={activitiesLogsLoading}
      />

      {/*  user profile activity timeline */}
      {!activitiesLogsLoading && activitiesLogs ? (
        Object.entries(activitiesLogs).map(([dayDate, activities]) => {
          return (
            <UserProfileActivityTimeline
              isLoading={activitiesLogsLoading}
              activities={activities}
              dayDate={dayDate}
            />
          );
        })
      ) : (
        <>
          {/* handle loading state */}
          <ActivityTimelineLoadingSkeleton />
        </>
      )}

      {/* Pagination component */}
      <div className="mt-8 flex justify-center w-full">
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={() => {}}
          currentLimit={limit}
          hidePagination={true}
          limitOptions={[10, 25, 50, 100]}
          onLimitChange={handleLimitChange}
        />
      </div>
    </>
  );
}
