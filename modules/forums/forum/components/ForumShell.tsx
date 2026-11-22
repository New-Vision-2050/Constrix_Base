"use client";

import { useEffect, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@i18n/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTER } from "@/router";
import { isForbidden, isNotFound } from "../../api/client";
import { useForum } from "../../hooks/use-forums";
import { StatusPill } from "../../components/ui/StatusChip";
import { forumStatusLabel, forumStatusTone } from "../../utils/labels";
import ForumTabsNav, { type ForumTabId } from "./ForumTabsNav";

/**
 * Page frame for every in-forum screen: breadcrumb, title, optional status pill,
 * the primary action, then the six-tab bar.
 */
export default function ForumShell({
  forumId,
  active,
  /** Screen title; falls back to the forum name (the overview screen). */
  title,
  /** Second breadcrumb segment, after the forum (or company) name. */
  breadcrumb,
  /** First breadcrumb segment; defaults to the forum name. */
  breadcrumbRoot,
  action,
  showStatus,
  children,
}: {
  forumId: string;
  active: ForumTabId;
  title?: string;
  breadcrumb?: string;
  breadcrumbRoot?: string;
  action?: ReactNode;
  showStatus?: boolean;
  children: ReactNode;
}) {
  const t = useTranslations("Forums");
  const router = useRouter();
  const { data: forum, isLoading, error } = useForum(forumId);

  // "The forum is not theirs" and "it was deleted" both send the user back.
  useEffect(() => {
    if (error && (isForbidden(error) || isNotFound(error))) {
      router.replace(ROUTER.FORUMS);
    }
  }, [error, router]);

  return (
    <div className="container mx-auto flex flex-col gap-5 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{breadcrumbRoot ?? forum?.name ?? t("title")}</span>
            {breadcrumb ? (
              <>
                <span aria-hidden>/</span>
                <span>{breadcrumb}</span>
              </>
            ) : null}
          </nav>
          {isLoading && !title ? (
            <Skeleton className="h-8 w-56" />
          ) : (
            <h1 className="text-2xl font-bold text-foreground">
              {title ?? forum?.name ?? ""}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-3">
          {showStatus && forum ? (
            <StatusPill
              label={forumStatusLabel(forum.status, t)}
              tone={forumStatusTone(forum.status)}
            />
          ) : null}
          {action}
        </div>
      </div>

      <ForumTabsNav forumId={forumId} active={active} />

      {children}
    </div>
  );
}
