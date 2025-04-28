import { SystemTab } from "@/modules/settings/types/SystemTab";
import { TabsTrigger } from "@radix-ui/react-tabs";

/**
 * TabsTriggerList Component
 *
 * Renders a list of authentication-related tab triggers.
 * Each tab is dynamically styled based on its active state.
 *
 * @returns JSX.Element - A list of tab triggers.
 */

type PropsT = {
  list: SystemTab[];
  onTabClick?: (tab: SystemTab) => void;
  bgStyleApproach?: boolean;
};

export default function TabsTriggerList({
  list,
  bgStyleApproach,
  onTabClick,
}: PropsT) {
  return <>{renderTabs(list, bgStyleApproach, onTabClick)}</>;
}

/**
 * Generates and returns a list of tab triggers.
 *
 * This function maps over the `SystemSettingTabs` array and renders
 * each tab using the `SingleTabTrigger` component.
 *
 * @returns JSX.Element[] - An array of tab trigger elements.
 */
function renderTabs(
  list: SystemTab[],
  bgStyleApproach?: boolean,
  onTabClick?: (tab: SystemTab) => void
) {
  return list.map((tab) => (
    <SingleTabTrigger
      key={tab.id}
      tab={tab}
      onTabClick={onTabClick}
      bgStyleApproach={bgStyleApproach}
    />
  ));
}

/**
 * SingleTabTrigger Component
 *
 * Represents an individual tab trigger.
 * This component is responsible for rendering a single tab
 * with the appropriate styles and properties.
 *
 * @param {SystemTab} tab - The tab object containing id and title.
 * @returns JSX.Element - A styled tab trigger.
 */
const SingleTabTrigger = ({
  tab,
  onTabClick,
  bgStyleApproach,
}: {
  tab: SystemTab;
  onTabClick?: (tab: SystemTab) => void;
  bgStyleApproach?: boolean;
}) => {
  const activeTabColor = bgStyleApproach
    ? "data-[state=active]:text-primary"
    : "data-[state=active]:text-foreground";

  return (
    <TabsTrigger
      key={tab.id}
      value={tab.id}
      onClick={() => {
        onTabClick?.(tab);
      }}
      className={`px-4 py-2 text-gray-600 rounded-none flex items-center gap-1
        data-[state=active]:border-b-2 data-[state=active]:border-primary 
        ${activeTabColor}`}
    >
      {Boolean(tab.icon) && tab.icon}
      {tab.title}
    </TabsTrigger>
  );
};
