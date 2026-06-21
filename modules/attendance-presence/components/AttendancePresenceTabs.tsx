"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Paper, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { SystemTab } from "@/modules/settings/types/SystemTab";
import AttendanceWorkLogContent, {
  ATTENDANCE_PRESENCE_MAIN_TAB_ICONS,
  PlaceholderContent,
} from "./AttendanceWorkLogContent";
import AttendanceReportsContent from "./Reports/AttendanceReportsContent";

const tabsRowSx = (indicatorColor: string) =>
  ({
    "& .MuiTabs-indicator": {
      height: 3,
      borderRadius: "4px 4px 0 0",
      backgroundColor: indicatorColor,
    },
    "& .MuiTab-root": {
      textTransform: "none",
      minHeight: 56,
    },
  }) as const;

export default function AttendancePresenceTabs() {
  const theme = useTheme();
  const isRtl = useIsRtl();
  const tabDirection = isRtl ? "rtl" : "ltr";
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const tabsRowStyles = tabsRowSx(theme.palette.primary.main);
  const t = useTranslations("AttendancePresence");
  const [activeTab, setActiveTab] = useState("attendance-presence-attendance-log");
  const [activeNestedTab, setActiveNestedTab] = useState(
    "attendance-presence-work-log",
  );

  const tabsList: SystemTab[] = useMemo(
    () => [
      {
        id: "attendance-presence-assigned-tasks",
        title: t("assignedTasks"),
        icon: ATTENDANCE_PRESENCE_MAIN_TAB_ICONS.assignedTasks,
        content: <PlaceholderContent messageKey="underDevelopment" />,
      },
      {
        id: "attendance-presence-attendance-log",
        title: t("attendanceLog"),
        icon: ATTENDANCE_PRESENCE_MAIN_TAB_ICONS.attendanceLog,
        content: null,
        nestedTabs: [
          {
            id: "attendance-presence-work-log",
            title: t("attendanceAndWorkLog"),
            content: <AttendanceWorkLogContent />,
          },
          {
            id: "attendance-presence-reports",
            title: t("attendanceReports"),
            content: <AttendanceReportsContent />,
          },
          {
            id: "attendance-presence-approvals",
            title: t("approvals"),
            content: <PlaceholderContent messageKey="underDevelopment" />,
          },
        ],
      },
      {
        id: "attendance-presence-attachments",
        title: t("attachments"),
        icon: ATTENDANCE_PRESENCE_MAIN_TAB_ICONS.attachments,
        content: <PlaceholderContent messageKey="underDevelopment" />,
      },
    ],
    [t],
  );

  const value =
    tabsList.find((tab) => tab.id === activeTab)?.id ?? tabsList[1]?.id ?? false;

  const activeMainTab = useMemo(
    () => tabsList.find((tab) => tab.id === value),
    [tabsList, value],
  );

  const nestedTabs = activeMainTab?.nestedTabs;

  useEffect(() => {
    if (!nestedTabs?.length) return;
    setActiveNestedTab((prev) =>
      nestedTabs.some((tab) => tab.id === prev) ? prev : nestedTabs[0].id,
    );
  }, [value, nestedTabs]);

  const activeContent = useMemo(() => {
    if (nestedTabs?.length) {
      const sub =
        nestedTabs.find((tab) => tab.id === activeNestedTab) ?? nestedTabs[0];
      return sub.content;
    }
    return activeMainTab?.content ?? null;
  }, [activeMainTab, nestedTabs, activeNestedTab]);

  const showNestedTabsRow = Boolean(nestedTabs && nestedTabs.length > 1);

  return (
    <div className="space-y-0" dir={tabDirection}>
      <Paper
        className="bg-sidebar"
        sx={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Tabs
            value={value}
            onChange={(_, v: string) => setActiveTab(v)}
            variant={isMdUp ? "fullWidth" : "scrollable"}
            scrollButtons={isMdUp ? false : "auto"}
            allowScrollButtonsMobile
            dir={tabDirection}
            sx={{
              flex: 1,
              minWidth: 0,
              width: "100%",
              ...tabsRowStyles,
            }}
          >
            {tabsList.map((tab) => (
              <Tab
                key={tab.id}
                value={tab.id}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Tabs
            value={
              nestedTabs!.some((tab) => tab.id === activeNestedTab)
                ? activeNestedTab
                : nestedTabs![0].id
            }
            onChange={(_, v: string) => setActiveNestedTab(v)}
            variant={isMdUp ? "fullWidth" : "scrollable"}
            scrollButtons={isMdUp ? false : "auto"}
            allowScrollButtonsMobile
            dir={tabDirection}
            sx={{ ...tabsRowStyles, px: { xs: 0, sm: 1 } }}
          >
            {nestedTabs!.map((tab) => (
              <Tab key={tab.id} value={tab.id} label={tab.title} />
            ))}
          </Tabs>
        </Paper>
      )}

      <div className="pt-4">{activeContent}</div>
    </div>
  );
}
