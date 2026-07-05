"use client";

import { useProjectTabsList } from "./constants/ProjectTabsList";
import ProjectTabsLayout from "./ProjectTabsLayout";

export default function StandardProjectTabs() {
  const tabsList = useProjectTabsList();

  return <ProjectTabsLayout tabsList={tabsList} />;
}
