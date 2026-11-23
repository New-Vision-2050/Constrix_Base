"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import HorizontalTabs from "@/components/shared/HorizontalTabs";
import type { SystemTab } from "@/modules/settings/types/SystemTab";
import {
  FORUMS_TABS,
  ForumsTabsProvider,
  useForumsTabs,
  type ForumsTabId,
} from "./context/ForumsTabsContext";
import ForumsListTab from "./components/forums-list/ForumsListTab";
import AnnouncementsTab from "./components/announcements/AnnouncementsTab";
import ReportsTab from "./components/reports/ReportsTab";

export default function ForumsModule() {
  return (
    <ForumsTabsProvider>
      <ForumsModuleContent />
    </ForumsTabsProvider>
  );
}

function ForumsModuleContent() {
  const t = useTranslations("Forums");
  const { tab, setTab } = useForumsTabs();

  const tabs = useMemo<SystemTab[]>(
    () => [
      {
        id: FORUMS_TABS.forums,
        title: t("tabs.forums"),
        content: <ForumsListTab />,
      },
      {
        id: FORUMS_TABS.announcements,
        title: t("tabs.announcements"),
        content: <AnnouncementsTab />,
      },
      {
        id: FORUMS_TABS.reports,
        title: t("tabs.reports"),
        content: <ReportsTab />,
      },
    ],
    [t],
  );

  const header = {
    [FORUMS_TABS.forums]: {
      title: t("title"),
      subtitle: t("subtitle"),
    },
    [FORUMS_TABS.announcements]: {
      title: t("announcements.title"),
      subtitle: t("announcements.subtitle"),
    },
    [FORUMS_TABS.reports]: {
      title: t("reports.title"),
      subtitle: t("reports.subtitle"),
    },
  }[tab];

  return (
    <div className="container mx-auto flex flex-col gap-5 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">{header.title}</h1>
        <p className="text-sm text-muted-foreground">{header.subtitle}</p>
      </div>

      <HorizontalTabs
        bgStyleApproach
        list={tabs}
        value={tab}
        defaultValue={tab}
        onTabClick={(clicked) => setTab(clicked.id as ForumsTabId)}
      />
    </div>
  );
}
