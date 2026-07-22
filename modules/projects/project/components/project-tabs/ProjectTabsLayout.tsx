"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Paper, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useSearchParams } from "@i18n/navigation";
import type { SystemTab } from "@/modules/settings/types/SystemTab";

const pillIndicatorSx = {
  height: "100%",
  borderRadius: "12px",
  backgroundColor: (theme: ReturnType<typeof useTheme>) =>
    alpha(theme.palette.primary.main, 0.14),
  border: "1px solid",
  borderColor: "primary.main",
  boxShadow: (theme: ReturnType<typeof useTheme>) =>
    `0 0 20px ${alpha(theme.palette.primary.main, 0.35)}`,
  top: 0,
  bottom: 0,
  zIndex: 0,
} as const;

type ProjectTabsLayoutProps = {
  tabsList: SystemTab[];
  defaultTabId?: string;
};

export default function ProjectTabsLayout({
  tabsList,
  defaultTabId,
}: ProjectTabsLayoutProps) {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [activeTab, setActiveTab] = useState<string>("");
  const [activeNestedTab, setActiveNestedTab] = useState<string>("");
  const [activeDeepNestedTab, setActiveDeepNestedTab] = useState<string>("");
  const searchParams = useSearchParams();
  const userSelected = useRef(false);

  useEffect(() => {
    if (tabsList.length === 0) return;

    if (userSelected.current) {
      if (!activeTab || !tabsList.some((t) => t.id === activeTab)) {
        setActiveTab(tabsList[0].id);
        userSelected.current = false;
      }
      return;
    }

    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && tabsList.some((t) => t.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
      return;
    }

    const fallbackTabId = defaultTabId ?? tabsList[0].id;
    if (!activeTab || !tabsList.some((t) => t.id === activeTab)) {
      setActiveTab(fallbackTabId);
    }
  }, [tabsList, activeTab, searchParams, defaultTabId]);

  const value =
    tabsList.find((t) => t.id === activeTab)?.id ?? tabsList[0]?.id ?? false;

  const activeMainTab = useMemo(
    () => tabsList.find((t) => t.id === value),
    [tabsList, value],
  );

  const nestedTabs = activeMainTab?.nestedTabs;

  const activeNestedTabObj = useMemo(() => {
    if (!nestedTabs?.length) return undefined;
    return (
      nestedTabs.find((tab) => tab.id === activeNestedTab) ?? nestedTabs[0]
    );
  }, [nestedTabs, activeNestedTab]);

  const deepNestedTabs = activeNestedTabObj?.nestedTabs;

  useEffect(() => {
    if (!nestedTabs?.length) return;
    setActiveNestedTab((prev) =>
      nestedTabs.some((t) => t.id === prev) ? prev : nestedTabs[0].id,
    );
  }, [value, nestedTabs]);

  useEffect(() => {
    if (!deepNestedTabs?.length) return;
    setActiveDeepNestedTab((prev) =>
      deepNestedTabs.some((t) => t.id === prev) ? prev : deepNestedTabs[0].id,
    );
  }, [activeNestedTab, deepNestedTabs]);

  const activeContent = useMemo(() => {
    if (nestedTabs?.length) {
      const sub = activeNestedTabObj ?? nestedTabs[0];
      if (sub.nestedTabs?.length) {
        const deep =
          sub.nestedTabs.find((tab) => tab.id === activeDeepNestedTab) ??
          sub.nestedTabs[0];
        return deep.content;
      }
      return sub.content;
    }
    return activeMainTab?.content ?? null;
  }, [activeMainTab, nestedTabs, activeNestedTabObj, activeDeepNestedTab]);

  const showNestedTabsRow = Boolean(nestedTabs?.length);
  const showDeepNestedTabsRow = Boolean(deepNestedTabs?.length);

  if (!tabsList.length) {
    return null;
  }

  return (
    <div className="space-y-0">
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden",
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.7),
          backdropFilter: "blur(12px)",
          backgroundImage: (theme) =>
            `linear-gradient(180deg, ${alpha(
              theme.palette.primary.main,
              0.06,
            )} 0%, transparent 100%)`,
          boxShadow: (theme) =>
            `0 4px 24px ${alpha(theme.palette.common.black, 0.25)}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            minWidth: 0,
            px: 1,
            py: 1,
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
            TabIndicatorProps={{
              sx: pillIndicatorSx,
            }}
            sx={{
              flex: 1,
              minWidth: 0,
              width: "100%",
              maxWidth: "100%",
              "& .MuiTabs-flexContainer": {
                gap: 0.5,
              },
              "& .MuiTab-root": {
                textTransform: "none",
                minHeight: 48,
                px: 2.5,
                py: 1,
                borderRadius: "12px",
                color: "text.secondary",
                fontWeight: 600,
                fontSize: "0.9375rem",
                transition: "all 0.2s ease",
                zIndex: 1,
                flexShrink: 0,
                maxWidth: "none",
                "&:hover": {
                  color: "text.primary",
                  bgcolor: "rgba(255, 255, 255, 0.03)",
                },
                "&.Mui-selected": {
                  color: "primary.main",
                  fontWeight: 700,
                },
              },
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
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "inherit",
                        "& svg": {
                          width: 18,
                          height: 18,
                        },
                      }}
                    >
                      {tab.icon}
                    </Box>
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
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
            borderRadius: "14px",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.55),
            backdropFilter: "blur(10px)",
            mt: 1.5,
            boxShadow: (theme) =>
              `0 4px 20px ${alpha(theme.palette.common.black, 0.2)}`,
          }}
        >
          <Box sx={{ px: 1, py: 1 }}>
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
              TabIndicatorProps={{
                sx: {
                  ...pillIndicatorSx,
                  borderRadius: "10px",
                },
              }}
              sx={{
                "& .MuiTabs-flexContainer": {
                  gap: 0.5,
                },
                "& .MuiTab-root": {
                  textTransform: "none",
                  minHeight: 40,
                  px: 2,
                  py: 0.75,
                  borderRadius: "10px",
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  transition: "all 0.2s ease",
                  zIndex: 1,
                  flexShrink: 0,
                  maxWidth: "none",
                  "&:hover": {
                    color: "text.primary",
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                  },
                  "&.Mui-selected": {
                    color: "primary.main",
                    fontWeight: 700,
                  },
                },
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
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.75,
                        position: "relative",
                        "& svg": {
                          width: 16,
                          height: 16,
                        },
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
      )}

      {showDeepNestedTabsRow && (
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.45),
            backdropFilter: "blur(8px)",
            mt: 1.5,
            boxShadow: (theme) =>
              `0 4px 16px ${alpha(theme.palette.common.black, 0.16)}`,
          }}
        >
          <Box sx={{ px: 1, py: 0.75 }}>
            <Tabs
              value={
                deepNestedTabs!.some((tab) => tab.id === activeDeepNestedTab)
                  ? activeDeepNestedTab
                  : deepNestedTabs![0].id
              }
              onChange={(_, v: string) => setActiveDeepNestedTab(v)}
              variant={isMdUp ? "fullWidth" : "scrollable"}
              scrollButtons={isMdUp ? false : "auto"}
              allowScrollButtonsMobile
              TabIndicatorProps={{
                sx: {
                  ...pillIndicatorSx,
                  borderRadius: "8px",
                },
              }}
              sx={{
                "& .MuiTabs-flexContainer": {
                  gap: 0.5,
                },
                "& .MuiTab-root": {
                  textTransform: "none",
                  minHeight: 36,
                  px: 1.75,
                  py: 0.5,
                  borderRadius: "8px",
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  transition: "all 0.2s ease",
                  zIndex: 1,
                  flexShrink: 0,
                  maxWidth: "none",
                  "&:hover": {
                    color: "text.primary",
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                  },
                  "&.Mui-selected": {
                    color: "primary.main",
                    fontWeight: 700,
                  },
                },
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
              {deepNestedTabs!.map((tab) => (
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
                        justifyContent: "center",
                        gap: 0.75,
                        position: "relative",
                        "& svg": {
                          width: 14,
                          height: 14,
                        },
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
      )}

      <Box className="py-4 min-h-[350px] transition-all duration-300">
        {activeContent}
      </Box>
    </div>
  );
}
