import UserProfileTableDataMainLayout from "../UserProfileTableDataMainLayout";
import pdfImg from "@/assets/icons/PDF.png";
import TimeLineItem from "./time-line-item";
import ActivityTimelineLoadingSkeleton from "./loading-skeleton";
import { UserActivityT } from "@/modules/user-profile/types/user-activity";

interface UserProfileActivityTimelineProps {
  isLoading?: boolean;
  activities?: UserActivityT[];
  enableRedirect?: boolean;
  redirectUrl?: string;
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
}: UserProfileActivityTimelineProps) {
  return (
    <UserProfileTableDataMainLayout
      title="سجل الانشطة"
      enableRedirect={enableRedirect}
      redirectUrl={redirectUrl}
    >
      <div>
        {isLoading ? (
          <ActivityTimelineLoadingSkeleton />
        ) : (
          <>
            {activities?.map((activity, index) => {
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
