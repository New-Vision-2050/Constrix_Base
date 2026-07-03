"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Paper, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import { useSearchParams } from "@i18n/navigation";
import { useProjectTabsList } from "./constants/ProjectTabsList";

const tabsRowSx = {
  "& .MuiTabs-indicator": {
    height: 3,
    borderRadius: "4px 4px 0 0",
  },
  "& .MuiTab-root": {
    textTransform: "none",
    minHeight: 56,
  },
} as const;

export default function ProjectTabs() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const tabsList = useProjectTabsList();
  const [activeTab, setActiveTab] = useState<string>("");
  const [activeNestedTab, setActiveNestedTab] = useState<string>("");
  const searchParams = useSearchParams();
  const userSelected = useRef(false);

  useEffect(() => {
    if (tabsList.length === 0) return;

    // If user manually picked a tab, only reset it when it becomes unavailable
    if (userSelected.current) {
      if (!activeTab || !tabsList.some((t) => t.id === activeTab)) {
        setActiveTab(tabsList[0].id);
        userSelected.current = false;
      }
      return;
    }

    // Otherwise, respect the URL tab param once it appears in the list
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && tabsList.some((t) => t.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
      return;
    }

    // Fallback to the first available tab
    if (!activeTab || !tabsList.some((t) => t.id === activeTab)) {
      setActiveTab(tabsList[0].id);
    }
  }, [tabsList, activeTab, searchParams]);

  const value =
    tabsList.find((t) => t.id === activeTab)?.id ?? tabsList[0]?.id ?? false;

  const activeMainTab = useMemo(
    () => tabsList.find((t) => t.id === value),
    [tabsList, value],
  );

  const nestedTabs = activeMainTab?.nestedTabs;

  useEffect(() => {
    if (!nestedTabs?.length) return;
    setActiveNestedTab((prev) =>
      nestedTabs.some((t) => t.id === prev) ? prev : nestedTabs[0].id,
    );
  }, [value, nestedTabs]);

  const activeContent = useMemo(() => {
    if (nestedTabs?.length) {
      const sub =
        nestedTabs.find((t) => t.id === activeNestedTab) ?? nestedTabs[0];
      return sub.content;
    }
    return activeMainTab?.content ?? null;
  }, [activeMainTab, nestedTabs, activeNestedTab]);

  const showNestedTabsRow = Boolean(nestedTabs && nestedTabs.length > 1);

  if (!tabsList.length) {
    return null;
  }

  return (
    <div className="space-y-0">
      <Paper
        className="bg-sidebar"
        sx={{
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            minWidth: 0,
          }}
        >
          <Tabs
            value={value}
            onChange={(_, v: string) => {
              userSelected.current = true;
              setActiveTab(v);
            }}
            variant={isMdUp ? "fullWidth" : "scrollable"}
            scrollButtons={isMdUp ? false : "auto"}
            allowScrollButtonsMobile
            indicatorColor="primary"
            textColor="primary"
            sx={{
              flex: 1,
              minWidth: 0,
              width: "100%",
              maxWidth: "100%",
              ...tabsRowSx,
              ...(!isMdUp && {
                "& .MuiTabScrollButton-root": { flexShrink: 0 },
                "& .MuiTabs-scroller": {
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                },
              }),
            }}
          >
            {tabsList.map((tab) => (
              <Tab
                key={tab.id}
                value={tab.id}
                sx={{
                  flexShrink: 0,
                  maxWidth: "none",
                }}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {tab.icon}
                    <span>{tab.title}</span>
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>
      </Paper>

      {showNestedTabsRow && (
        <Paper
          className="bg-sidebar"
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Tabs
            value={
              nestedTabs!.some((t) => t.id === activeNestedTab)
                ? activeNestedTab
                : nestedTabs![0].id
            }
            onChange={(_, v: string) => setActiveNestedTab(v)}
            variant={isMdUp ? "fullWidth" : "scrollable"}
            scrollButtons={isMdUp ? false : "auto"}
            allowScrollButtonsMobile
            indicatorColor="primary"
            textColor="primary"
            sx={{
              ...tabsRowSx,
              px: { xs: 0, sm: 1 },
              ...(!isMdUp && {
                "& .MuiTabScrollButton-root": { flexShrink: 0 },
                "& .MuiTabs-scroller": {
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                },
              }),
            }}
          >
            {nestedTabs!.map((tab) => (
              <Tab
                key={tab.id}
                value={tab.id}
                sx={{
                  flexShrink: 0,
                  maxWidth: "none",
                }}
                label={<span>{tab.title}</span>}
              />
            ))}
          </Tabs>
        </Paper>
      )}

      <Box className="py-4 min-h-[350px] transition-all duration-300">
        {activeContent}
      </Box>
    </div>
  );
}
