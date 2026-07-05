"use client";

import dynamic from "next/dynamic";
import { useOptionalContractualEngagement } from "@/modules/projects/project/context/ContractualEngagementContext";
import EngagementProjectTabs from "./EngagementProjectTabs";

const StandardProjectTabs = dynamic(() => import("./StandardProjectTabs"), {
  ssr: false,
});

type ProjectTabsProps = {
  variant?: "engagement" | "project";
};

export default function ProjectTabs({ variant }: ProjectTabsProps) {
  const engagementContext = useOptionalContractualEngagement();
  const isEngagement = variant === "engagement" || !!engagementContext;

  if (isEngagement) {
    return <EngagementProjectTabs />;
  }

  return <StandardProjectTabs />;
}
