"use client";

import { useState } from "react";
import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { useProjectTabsList } from "./constants/ProjectTabsList";

export default function ProjectTabs() {
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const tabsList = useProjectTabsList();

  return (
    <HorizontalTabs
      bgStyleApproach
      onTabClick={(tab) => {
        setActiveTab(tab.id);
      }}
      list={tabsList}
      value={activeTab}
    />
  );
}
