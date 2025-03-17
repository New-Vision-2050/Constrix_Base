import { TabsTrigger } from "@radix-ui/react-tabs";
import { SystemSettingTabs } from "../constants/Tabs";
import { SystemTab } from "../types/SystemTab";

/**
 * TabsTriggerList Component
 *
 * Renders a list of authentication-related tab triggers.
 * Each tab is dynamically styled based on its active state.
 *
 * @returns JSX.Element - A list of tab triggers.
 */
export default function TabsTriggerList() {
  return <>{renderTabs()}</>;
}

/**
 * Generates and returns a list of tab triggers.
 *
 * This function maps over the `SystemSettingTabs` array and renders
 * each tab using the `SingleTabTrigger` component.
 *
 * @returns JSX.Element[] - An array of tab trigger elements.
 */
function renderTabs() {
  return SystemSettingTabs.map((tab) => (
    <SingleTabTrigger key={tab.id} tab={tab} />
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
const SingleTabTrigger = ({ tab }: { tab: SystemTab }) => {
  return (
    <TabsTrigger
      key={tab.id}
      value={tab.id}
      className="px-4 py-2 text-gray-600 rounded-none 
                 data-[state=active]:border-b-2 data-[state=active]:border-primary 
                 data-[state=active]:text-white"
    >
      {tab.title}
    </TabsTrigger>
  );
};
