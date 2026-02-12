"use client";

import React from "react";
import { useTranslations } from "next-intl";
import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { useWorkPanelContext } from "../context/WorkPanelContext";
import { GetWorkPanelMainTabs } from "../constants/WorkPanelMainTabs";

export default function WorkPanelMainTabs() {
  const { tab1, setTab1 } = useWorkPanelContext();
  const t = useTranslations("WorkPanel");

  return (
    <HorizontalTabs
      bgStyleApproach
      onTabClick={(tab) => {
        setTab1(tab.id);
      }}
      list={GetWorkPanelMainTabs(t)}
      value={tab1 || undefined}
      defaultValue={tab1 !== null ? tab1 : undefined}
    />
  );
}

