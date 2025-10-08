import ItemDetailsHeader from "./components/ItemDetailsHeader";
import ActivitySectionComponent from "./components/ActivitySectionComponent";
import MoreSection from "./components/MoreSection";
import { ItemDetailsProps } from "./types/ItemDetailsTypes";
import { mockItemDetailsData } from "./data/mockData";
import { usePublicDocsCxt } from "../../../contexts/public-docs-cxt";
import { useTranslations } from "next-intl";
import useDocActivityLogs from "./hooks/useDocActvityLogs";
import TimeLineItem from "@/modules/dashboard/components/activity-timeline/time-line-item";
import { ClockIcon, UserIcon } from "lucide-react";

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
/**
 * Item Details Component - displays detailed information about the selected item
 * Follows SOLID principles in design
 */
export default function ItemDetails() {
  const t = useTranslations("docs-library.publicDocs.ActivityLogs");
  const { selectedDocument, storeSelectedDocument } = usePublicDocsCxt();
  const { data: itemLogs, isLoading } = useDocActivityLogs(
    selectedDocument?.id ?? ""
  );

  return (
    <div className="h-full bg-sidebar flex flex-col shadow-[5px_5px_5px_5px_#00000066,_-5px_-5px_5px_5px_#00000066] rounded-lg">
      {/* Details Header */}
      <ItemDetailsHeader title={selectedDocument?.name ?? "_"} />

      {/* Activity Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* Activity Log Title */}
          <p className="text-base font-medium text-dark dark:text-white mb-6">
            {t("title")}
          </p>

          {/* Handle loading state */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {t("loading")}
              </p>
            </div>
          ) : itemLogs && itemLogs.length > 0 ? (
            /* Activity Sections */
            itemLogs.map((activity, activityIndex) => {
              const currentTime = new Date();
              const updatedTime = new Date(activity.updated_at);
              const _timeAgo = timeAgo(updatedTime, currentTime);
              const isLastItem = activityIndex === itemLogs?.length - 1;

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
            })
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <ClockIcon className="w-16 h-16 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400 text-center">
                {t("noActivities", {
                  defaultValue: "لا توجد أنشطة متاحة لهذا المستند",
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* More Section */}
      <MoreSection onMoreClick={() => {}} />
    </div>
  );
}
