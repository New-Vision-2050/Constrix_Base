"use client";

import { useContractualEngagementTabsList } from "./constants/ContractualEngagementTabsList";
import ProjectTabsLayout from "./ProjectTabsLayout";

export default function EngagementProjectTabs() {
  const tabsList = useContractualEngagementTabsList();

  return (
    <ProjectTabsLayout
      tabsList={tabsList}
      defaultTabId="engagement-tab-attachments"
    />
  );
}
