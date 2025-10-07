import ItemDetailsHeader from "./components/ItemDetailsHeader";
import ActivitySectionComponent from "./components/ActivitySectionComponent";
import MoreSection from "./components/MoreSection";
import { ItemDetailsProps } from "./types/ItemDetailsTypes";
import { mockItemDetailsData } from "./data/mockData";
import { usePublicDocsCxt } from "../../../contexts/public-docs-cxt";

/**
 * Item Details Component - displays detailed information about the selected item
 * Follows SOLID principles in design
 */
export default function ItemDetails({
  data = mockItemDetailsData,
  onClose,
  onMoreClick,
}: ItemDetailsProps) {
  const { selectedDocument, storeSelectedDocument } = usePublicDocsCxt();
  return (
    <div className="h-full bg-sidebar flex flex-col shadow-[5px_5px_5px_5px_#00000066,_-5px_-5px_5px_5px_#00000066] rounded-lg">
      {/* Details Header */}
      <ItemDetailsHeader title={selectedDocument?.name ?? "_"} />

      {/* Activity Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* Activity Log Title */}
          <p className="text-base font-medium  text-dark dark:text-white mb-6">
            سجل النشاط
          </p>

          {/* Activity Sections */}
          {data.activitySections.map((section) => (
            <ActivitySectionComponent key={section.id} section={section} />
          ))}
        </div>
      </div>

      {/* More Section */}
      <MoreSection onMoreClick={onMoreClick} />
    </div>
  );
}
