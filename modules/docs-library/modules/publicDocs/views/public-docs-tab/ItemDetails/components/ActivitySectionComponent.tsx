import ActivityItemComponent from "./ActivityItemComponent";
import { ActivitySection } from "../types/ItemDetailsTypes";

interface ActivitySectionComponentProps {
  section: ActivitySection;
}

export default function ActivitySectionComponent({
  section,
}: ActivitySectionComponentProps) {
  return (
    <div className="mb-6">
      {/* Section Title */}
      <h3 className="text-dark dark:text-white w-fit text-sm font-medium px-4 py-2 bg-gray-800/50 rounded-full">
        {section.title}
      </h3>

      {/* Activity Items */}
      <div className="space-y-2">
        {section.items.map((item) => (
          <ActivityItemComponent key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
