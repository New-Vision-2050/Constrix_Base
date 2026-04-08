"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Paper, Tab, Tabs } from "@mui/material";
import { useProjectTabsList } from "./constants/ProjectTabsList";

export default function ProjectTabs() {
  const tabsList = useProjectTabsList();
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    if (tabsList.length === 0) return;
    if (!activeTab || !tabsList.some((t) => t.id === activeTab)) {
      setActiveTab(tabsList[0].id);
    }
  }, [tabsList, activeTab]);

  const value =
    tabsList.find((t) => t.id === activeTab)?.id ?? tabsList[0]?.id ?? false;

  const activeContent = useMemo(
    () => tabsList.find((t) => t.id === value)?.content,
    [tabsList, value],
  );

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
            onChange={(_, v: string) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: "100%",
              "& .MuiTabScrollButton-root": {
                flexShrink: 0,
              },
              "& .MuiTabs-scroller": {
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              },
            }}
          >
            {tabsList.map((tab) => (
              <Tab
                key={tab.id}
                value={tab.id}
                sx={{
                  flexShrink: 0,
                  maxWidth: "none",
                  minHeight: 56,
                  textTransform: "none",
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
      <Box className="py-4 min-h-[350px] transition-all duration-300">
        {activeContent}
      </Box>
    </div>
  );
}
