"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "@i18n/navigation";

export const FORUMS_TABS = {
  forums: "forums",
  announcements: "announcements",
  reports: "reports",
} as const;

export type ForumsTabId = (typeof FORUMS_TABS)[keyof typeof FORUMS_TABS];

const VALID: string[] = Object.values(FORUMS_TABS);

type ForumsTabsContextValue = {
  tab: ForumsTabId;
  setTab: (tab: ForumsTabId) => void;
  /** Forum preselected by the reports tab, kept across tab switches. */
  reportsForumId: string;
  setReportsForumId: (forumId: string) => void;
};

const ForumsTabsContext = createContext<ForumsTabsContextValue | undefined>(
  undefined,
);

export function ForumsTabsProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();

  const [tab, setTab] = useState<ForumsTabId>(() => {
    const fromUrl = searchParams.get("tab");
    return (VALID.includes(fromUrl ?? "") ? fromUrl : FORUMS_TABS.forums) as ForumsTabId;
  });
  const [reportsForumId, setReportsForumId] = useState<string>(
    () => searchParams.get("forum") ?? "",
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    if (reportsForumId) {
      params.set("forum", reportsForumId);
    } else {
      params.delete("forum");
    }
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [tab, reportsForumId, searchParams]);

  const value = useMemo(
    () => ({ tab, setTab, reportsForumId, setReportsForumId }),
    [tab, reportsForumId],
  );

  return (
    <ForumsTabsContext.Provider value={value}>
      {children}
    </ForumsTabsContext.Provider>
  );
}

export function useForumsTabs() {
  const context = useContext(ForumsTabsContext);
  if (!context) {
    throw new Error("useForumsTabs must be used within a ForumsTabsProvider");
  }
  return context;
}
