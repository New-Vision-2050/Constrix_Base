"use client";

import { useState } from "react";
import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { GetProjectTabsList } from "./constants/ProjectTabsList";

export default function ProjectTabs() {
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

  return (
    <HorizontalTabs
      bgStyleApproach
      onTabClick={(tab) => {
        setActiveTab(tab.id);
      }}
      list={GetProjectTabsList()}
      value={activeTab}
    />
  );
}

