import ActivityTimelineLoadingSkeleton from "@/modules/dashboard/components/activity-timeline/loading-skeleton";
import UserProfileTableDataMainLayout from "@/modules/dashboard/components/UserProfileTableDataMainLayout";
import { ActivitiesLogsT } from "../apis/get-activities-logs";
import TimeLineItem from "@/modules/dashboard/components/activity-timeline/time-line-item";
import { ClockIcon, UserIcon } from "lucide-react";

interface UserLogsTimeLineProps {
  isLoading?: boolean;
  daysActivities?: ActivitiesLogsT;
}

function timeAgo(updatedTime: Date, currentTime: Date) {
  const diffInMinutes = Math.floor(
    (currentTime.getTime() - updatedTime.getTime()) / 60000
  );
  if (diffInMinutes < 60) {
    return `${diffInMinutes} دقيقة`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)} ساعة`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)} يوم`;
  }
}

export default function UserLogsTimeLine({
  isLoading = false,
  daysActivities,
}: UserLogsTimeLineProps) {
  return (
    <UserProfileTableDataMainLayout title={"سجل الانشطة"}>
      <div>
        {isLoading ? (
          <ActivityTimelineLoadingSkeleton />
        ) : (
          daysActivities &&
          Object.entries(daysActivities).map(
            ([dayDate, activities], index, array) => {
              const isLastDay = index === array.length - 1;

              return (
                <div key={dayDate + "," + index}>
                  {dayDate && (
                    <div className="flex gap-4 mb-6">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 p-2 bg-primary/20 dark:bg-primary/30 rounded-full flex items-center justify-center border border-primary/30">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="inline-block bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm shadow-sm">
                          {dayDate}
                        </div>
                      </div>
                    </div>
                  )}
                  {activities?.map((activity, activityIndex) => {
                    const currentTime = new Date();
                    const updatedTime = new Date(activity.updated_at);
                    const _timeAgo = timeAgo(updatedTime, currentTime);
                    const isLastItem = activityIndex === activities.length - 1;

                    return (
                      <TimeLineItem
                        key={activity.id}
                        title={activity.title}
                        time={_timeAgo}
                        event={activity.event}
                        isLastItem={isLastItem}
                        descriptionContent={
                          <div className="flex gap-4">
                            {/* time */}
                            <div className="flex items-center gap-2">
                              <ClockIcon className="w-4 h-4 text-pink-700" />
                              <span>
                                {updatedTime.toLocaleDateString("en-GB") +
                                  " " +
                                  updatedTime.toLocaleTimeString("en-GB", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  })}
                              </span>
                            </div>
                            {/* user name */}
                            <div className="flex items-center gap-2">
                              <UserIcon className="w-4 h-4 text-yellow-600" />
                              <span>{activity.user?.name ?? "-"}</span>
                            </div>
                          </div>
                        }
                      />
                    );
                  })}
                  {/* add beauty horizontal line - only if not the last day */}
                  {!isLastDay && (
                    <div className="w-full h-px bg-gray-300 dark:bg-gray-600 my-6"></div>
                  )}
                </div>
              );
            }
          )
        )}
      </div>
    </UserProfileTableDataMainLayout>
  );
}
