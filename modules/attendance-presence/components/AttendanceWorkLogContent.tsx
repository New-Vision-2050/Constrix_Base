"use client";

import React from "react";
import { UserPlus, FolderOpen, ClipboardList } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAttendanceDirection } from "../utils/direction";
import SummaryCardsRow from "./SummaryCards/SummaryCardsRow";
import TodayLogPanel from "./TodayLog/TodayLogPanel";
import WorkLogSection from "./WorkLog/WorkLogSection";

export default function AttendanceWorkLogContent() {
  const { dir, isRtl, workLogGridClass } = useAttendanceDirection();

  return (
    <div className="flex flex-col gap-4" dir={dir}>
      <SummaryCardsRow />

      <div className={workLogGridClass}>
        {isRtl ? (
          <>
            <WorkLogSection />
            <TodayLogPanel />
          </>
        ) : (
          <>
            <TodayLogPanel />
            <WorkLogSection />
          </>
        )}
      </div>
    </div>
  );
}

export function PlaceholderContent({ messageKey }: { messageKey: string }) {
  const t = useTranslations("AttendancePresence");

  return (
    <div className="flex items-center justify-center min-h-[300px] text-muted-foreground">
      {t(messageKey as "underDevelopment")}
    </div>
  );
}

export const ATTENDANCE_PRESENCE_MAIN_TAB_ICONS = {
  assignedTasks: <ClipboardList size={20} />,
  attendanceLog: <UserPlus size={20} />,
  attachments: <FolderOpen size={20} />,
};
