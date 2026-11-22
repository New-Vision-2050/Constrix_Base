"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { Button } from "@/components/ui/button";
import { Link } from "@i18n/navigation";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { ROUTER } from "@/router";
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
import CreateForumWizard from "./components/create-forum/CreateForumWizard";

export default function ForumsModule() {
  return (
    <ForumsTabsProvider>
      <ForumsModuleContent />
    </ForumsTabsProvider>
  );
}

function ForumsModuleContent() {
  const t = useTranslations("Forums");
  const { can } = usePermissions();
  const { tab, setTab } = useForumsTabs();
  const [wizardOpen, setWizardOpen] = useState(false);

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

  // Title, subtitle and primary action all follow the active tab in the design.
  const header = {
    [FORUMS_TABS.forums]: {
      title: t("title"),
      subtitle: t("subtitle"),
      action: can([PERMISSIONS.forum.create]) ? (
        <Button onClick={() => setWizardOpen(true)}>
          <Plus />
          {t("list.create")}
        </Button>
      ) : null,
    },
    [FORUMS_TABS.announcements]: {
      title: t("announcements.title"),
      subtitle: t("announcements.subtitle"),
      action: can([PERMISSIONS.forum.announcement.create]) ? (
        <Button asChild>
          <Link href={ROUTER.FORUM_ANNOUNCEMENT_NEW}>
            <Plus />
            {t("announcements.create")}
          </Link>
        </Button>
      ) : null,
    },
    [FORUMS_TABS.reports]: {
      title: t("reports.title"),
      subtitle: t("reports.subtitle"),
      action: null,
    },
  }[tab];

  return (
    <div className="container mx-auto flex flex-col gap-5 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground">
            {header.title}
          </h1>
          <p className="text-sm text-muted-foreground">{header.subtitle}</p>
        </div>
        {header.action}
      </div>

      <HorizontalTabs
        bgStyleApproach
        list={tabs}
        value={tab}
        defaultValue={tab}
        onTabClick={(clicked) => setTab(clicked.id as ForumsTabId)}
      />

      {wizardOpen ? (
        <CreateForumWizard
          open={wizardOpen}
          onClose={() => setWizardOpen(false)}
        />
      ) : null}
    </div>
  );
}
