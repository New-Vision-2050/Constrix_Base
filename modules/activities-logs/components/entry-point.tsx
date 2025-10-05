"use client";
import UserProfileActivityTimeline from "@/modules/dashboard/components/activity-timeline";
import ActivitiesLogsSearchFields from "./SearchFields";
import { LOGS_ACTIVITIES } from "./dummy-data";
import { Pagination } from "@/components/shared/Pagination";

export default function ActivitiesLogsEntryPoint() {
  return (
    <>
      {/* search fields */}
      <ActivitiesLogsSearchFields
        data={{}}
        onChange={() => {}}
        isLoading={false}
      />

      {/*  user profile activity timeline */}
      <UserProfileActivityTimeline
        isLoading={false}
        activities={LOGS_ACTIVITIES}
      />
      
      {/* Pagination component */}
      <div className="mt-8 flex justify-center w-full">
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={() => {}}
          currentLimit={1}
          limitOptions={[2, 5, 10, 25, 50]}
          onLimitChange={() => {}}
        />
      </div>
    </>
  );
}
