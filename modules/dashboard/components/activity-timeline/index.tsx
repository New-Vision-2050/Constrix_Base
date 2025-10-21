import UserProfileTableDataMainLayout from "../UserProfileTableDataMainLayout";
import pdfImg from "@/assets/icons/PDF.png";
import TimeLineItem from "./time-line-item";
import ActivityTimelineLoadingSkeleton from "./loading-skeleton";
import { UserActivityT } from "@/modules/user-profile/types/user-activity";
import { useTranslations } from "next-intl";

interface UserProfileActivityTimelineProps {
  isLoading?: boolean;
  activities?: UserActivityT[];
  enableRedirect?: boolean;
  redirectUrl?: string;
  title?: string;
  dayDate?: string;
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

export default function UserProfileActivityTimeline({
  isLoading = false,
  activities,
  enableRedirect,
  redirectUrl,
  title,
  dayDate,
}: UserProfileActivityTimelineProps) {
  const t = useTranslations("UserProfile.ActivityTimeline");
  return (
    <UserProfileTableDataMainLayout
      title={title ?? t("title")}
      enableRedirect={enableRedirect}
      redirectUrl={redirectUrl}
    >
      <div>
        {isLoading ? (
          <ActivityTimelineLoadingSkeleton />
        ) : (
          <>
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
            {activities?.map((activity) => {
              const currentTime = new Date();
              const updatedTime = new Date(activity.updated_at);
              const _timeAgo = timeAgo(updatedTime, currentTime);

              return (
                <TimeLineItem
                  key={activity.id}
                  title={activity.title}
                  time={_timeAgo}
                  event={activity.event}
                />
              );
            })}
          </>
        )}
      </div>
    </UserProfileTableDataMainLayout>
  );
}
