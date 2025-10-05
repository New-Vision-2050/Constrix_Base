import { ActivityTimelineEvent } from "@/modules/user-profile/types/user-activity";
import { EditIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type PropsT = {
  title: string;
  time: string;
  description?: string;
  descriptionContent?: React.ReactNode;
  event?: ActivityTimelineEvent;
};

export default function TimeLineItem(props: PropsT) {
  const t = useTranslations("UserProfile.ActivityTimeline");
  let pointBgColorClass = "bg-pink-500";
  let activityIcon = <PlusIcon className="w-4 h-4" />;
  const { title, time, descriptionContent, event } = props;

  const operationTitle = (event: ActivityTimelineEvent) => {
    switch (event) {
      case "created":
        return t("createdOperation");
      case "updated":
        return t("updatedOperation");
      case "deleted":
        return t("deletedOperation");
    }
  };

  if (event === "created") {
    pointBgColorClass = "bg-green-500";
    activityIcon = <PlusIcon className="w-4 h-4" />;
  } else if (event === "updated") {
    pointBgColorClass = "bg-blue-500";
    activityIcon = <EditIcon className="w-4 h-4" />;
  } else if (event === "deleted") {
    pointBgColorClass = "bg-red-500";
    activityIcon = <TrashIcon className="w-4 h-4" />;
  }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 p-2 ${pointBgColorClass} rounded-full flex items-center justify-center`}
        >
          {activityIcon}
        </div>
        <div className="w-px bg-gray-300 h-full"></div>
      </div>
      <div className="flex-grow ">
        <div className="flex justify-between flex-wrap gap-4 mb-2">
          <span className="font-medium">
            {operationTitle(event ?? "created")}
          </span>
          <span className="text-sm text-gray-500">{time}</span>
        </div>
        <p className="mb-2">{title}</p>
        <div className="flex items-center gap-2 px-3 py-1">
          {descriptionContent}
        </div>
      </div>
    </div>
  );
}
