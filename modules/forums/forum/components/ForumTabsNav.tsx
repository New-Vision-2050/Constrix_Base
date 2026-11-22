"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@i18n/navigation";
import { cn } from "@/lib/utils";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { ROUTER } from "@/router";

export type ForumTabId =
  | "overview"
  | "groups"
  | "members"
  | "admins"
  | "settings"
  | "activity";

/**
 * The six in-forum tabs. Each one is its own route in the design, so this is a
 * link bar rather than a Radix tab set — the active styling matches
 * `HorizontalTabs` (pink bottom border + pink label).
 */
export default function ForumTabsNav({
  forumId,
  active,
}: {
  forumId: string;
  active: ForumTabId;
}) {
  const t = useTranslations("Forums.forum.tabs");
  const { can } = usePermissions();

  const tabs = useMemo(
    () =>
      (
        [
          { id: "overview", title: t("overview"), href: ROUTER.FORUM_DETAILS(forumId), show: true },
          {
            id: "groups",
            title: t("groups"),
            href: ROUTER.FORUM_GROUPS(forumId),
            show: can([PERMISSIONS.forum.group.list]),
          },
          {
            id: "members",
            title: t("members"),
            href: ROUTER.FORUM_MEMBERS(forumId),
            show: can([PERMISSIONS.forum.member.list]),
          },
          {
            id: "admins",
            title: t("admins"),
            href: ROUTER.FORUM_ADMINS(forumId),
            show: can([PERMISSIONS.forum.admin.list]),
          },
          {
            id: "settings",
            title: t("settings"),
            href: ROUTER.FORUM_SETTINGS(forumId),
            show: can([PERMISSIONS.forum.update]),
          },
          {
            id: "activity",
            title: t("activity"),
            href: ROUTER.FORUM_ACTIVITY(forumId),
            show: can([PERMISSIONS.forum.activity.list]),
          },
        ] as const
      ).filter((tab) => tab.show),
    [forumId, t, can],
  );

  return (
    <div className="flex min-h-14 items-center gap-4 overflow-x-auto whitespace-nowrap rounded-md bg-sidebar px-2 scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "rounded-none px-4 py-2 text-sm transition-colors",
              isActive
                ? "border-b-2 border-primary font-medium text-primary"
                : "text-gray-600 hover:text-foreground",
            )}
          >
            {tab.title}
          </Link>
        );
      })}
    </div>
  );
}
