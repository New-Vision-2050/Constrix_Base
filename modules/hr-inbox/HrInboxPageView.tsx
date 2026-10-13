"use client";

import { useState } from "react";
import { Badge, Box, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import withPermissions from "@/lib/permissions/client/withPermissions";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import EmployeeTasksInboxTab from "@/modules/hr-inbox/components/EmployeeTasksInboxTab";
import LeaveRequestsTab from "@/modules/hr-inbox/components/approval-requests/LeaveRequestsTab";
import AdvanceRequestsTab from "@/modules/hr-inbox/components/approval-requests/AdvanceRequestsTab";
import { HrInboxEchoSubscriber } from "@/modules/hr-inbox/components/HrInboxEchoSubscriber";
import { useApprovalInboxCounts } from "@/modules/hr-inbox/hooks/useApprovalInboxCounts";

type TabValue = "tasks" | "leave" | "advance";

/** Notification-style counter on the tab label (hidden when zero). */
function NotifyBadge({ count, children }: { count: number; children: React.ReactNode }) {
  return (
    <Badge
      badgeContent={count}
      color="error"
      invisible={!count}
      max={99}
      overlap="rectangular"
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{
        "& .MuiBadge-badge": {
          fontWeight: 700,
          transform: "translate(60%, -35%)",
        },
      }}
    >
      {children}
    </Badge>
  );
}

function HrInboxPageView() {
  const t = useTranslations("HrInbox");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [tab, setTab] = useState<TabValue>("tasks");
  const { tasksCount, leaveCount, advanceCount } = useApprovalInboxCounts();

  return (
    <Box className="container mx-auto p-6">
      <HrInboxEchoSubscriber />

      <Box className="mb-8">
        <Typography variant="h6" className="font-bold mb-2">
          {t("pageTitle")}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          className="mt-2 max-w-2xl leading-relaxed"
        >
          {t("pageDescription")}
        </Typography>
      </Box>

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as TabValue)}
        className="w-full"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <TabsList
          className="w-full px-4 md:px-10 justify-start gap-6 h-max mb-4 bg-sidebar py-2 text-foreground"
          dir={isRtl ? "rtl" : "ltr"}
        >
          <TabsTrigger
            value="tasks"
            className="w-fit gap-2 py-4 px-2 data-[state=active]:bg-sidebar border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
          >
            <NotifyBadge count={tasksCount}>{t("tabs.tasks")}</NotifyBadge>
          </TabsTrigger>
          <TabsTrigger
            value="leave"
            className="w-fit gap-2 py-4 px-2 data-[state=active]:bg-sidebar border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
          >
            <NotifyBadge count={leaveCount}>{t("tabs.leave")}</NotifyBadge>
          </TabsTrigger>
          <TabsTrigger
            value="advance"
            className="w-fit gap-2 py-4 px-2 data-[state=active]:bg-sidebar border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
          >
            <NotifyBadge count={advanceCount}>{t("tabs.advance")}</NotifyBadge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" dir={isRtl ? "rtl" : "ltr"}>
          <EmployeeTasksInboxTab />
        </TabsContent>
        <TabsContent value="leave" dir={isRtl ? "rtl" : "ltr"}>
          <LeaveRequestsTab />
        </TabsContent>
        <TabsContent value="advance" dir={isRtl ? "rtl" : "ltr"}>
          <AdvanceRequestsTab />
        </TabsContent>
      </Tabs>
    </Box>
  );
}

export default withPermissions(HrInboxPageView, [
  [
    PERMISSIONS.humanResources.charts.view,
    PERMISSIONS.humanResources.procedures.view,
    PERMISSIONS.humanResources.services.view,
  ],
]);
