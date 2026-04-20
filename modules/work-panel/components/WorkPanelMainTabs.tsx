"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { useWorkPanelContext } from "../context/WorkPanelContext";
import { GetWorkPanelMainTabs } from "../constants/WorkPanelMainTabs";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";

export default function WorkPanelMainTabs() {
  const { tab1, setTab1 } = useWorkPanelContext();
  const t = useTranslations("WorkPanel");
  const { can } = usePermissions();

  const tabs = useMemo(
    () => GetWorkPanelMainTabs(t).filter((tab) => can(tab.permission)),
    [t, can],
  );

  return (
    <HorizontalTabs
      bgStyleApproach
      onTabClick={(tab) => {
        setTab1(tab.id);
      }}
      list={tabs}
      value={tab1 || undefined}
      defaultValue={tab1 !== null ? tab1 : undefined}
    />
  );
}
