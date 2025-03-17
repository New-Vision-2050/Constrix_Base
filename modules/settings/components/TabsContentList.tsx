import { TabsContent } from "@radix-ui/react-tabs";

import { SystemTab } from "../types/SystemTab";
import { SystemSettingTabs } from "../constants/Tabs";

/**
 * TabsContentList Component
 *
 * Renders the content for each tab in the authentication system.
 * This component dynamically generates content sections for the tabs.
 *
 * @returns JSX.Element - The content for all tabs.
 */
export default function TabsContentList() {
  return <>{renderTabsContent()}</>;
}

/**
 * Renders the content for all tabs.
 *
 * Maps over the `AuthLoginTabs` array and returns a `SingleTabContent`
 * component for each tab.
 *
 * @returns JSX.Element[] - An array of tab content elements.
 */
function renderTabsContent() {
  return SystemSettingTabs.map((tab) => (
    <SingleTabContent key={tab.id} tab={tab} />
  ));
}

/**
 * SingleTabContent Component
 *
 * Represents the content section of a single tab.
 * Displays the tab's content when it is active.
 *
 * @param {SystemTab} tab - The tab object containing id and content.
 * @returns JSX.Element - The tab's content wrapper.
 */
const SingleTabContent = ({ tab }: { tab: SystemTab }) => {
  return (
    <TabsContent value={tab.id} className="p-4">
      {tab.content}
    </TabsContent>
  );
};
