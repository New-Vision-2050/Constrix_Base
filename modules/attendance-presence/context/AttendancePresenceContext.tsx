"use client";

import React, { createContext, useContext, useState } from "react";
import { WorkLogViewMode } from "../types";

interface AttendancePresenceContextType {
  workLogView: WorkLogViewMode;
  setWorkLogView: (view: WorkLogViewMode) => void;
  activePeriod: string;
  setActivePeriod: (period: string) => void;
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
}

const AttendancePresenceContext = createContext<
  AttendancePresenceContextType | undefined
>(undefined);

export function AttendancePresenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [workLogView, setWorkLogView] = useState<WorkLogViewMode>("calendar");
  const [activePeriod, setActivePeriod] = useState("period-1");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const value = {
    workLogView,
    setWorkLogView,
    activePeriod,
    setActivePeriod,
    selectedMonth,
    setSelectedMonth,
  };

  return (
    <AttendancePresenceContext.Provider value={value}>
      {children}
    </AttendancePresenceContext.Provider>
  );
}

export function useAttendancePresence() {
  const context = useContext(AttendancePresenceContext);
  if (!context) {
    throw new Error(
      "useAttendancePresence must be used within AttendancePresenceProvider",
    );
  }
  return context;
}
