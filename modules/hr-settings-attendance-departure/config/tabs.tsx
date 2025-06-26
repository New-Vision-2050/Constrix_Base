import React from "react";
import { SystemTab } from "@/modules/settings/types/SystemTab";
import { User2Icon } from "lucide-react";
import AttendanceDeterminantsTab from "../tabs/attendance-determinants";

// Tabs config for HR settings
export const HRSettingsAttendanceDepartureTabsList: SystemTab[] = [
  {
    id: "attendance-departure-setting-tab",
    title: "محددات الحضور",
    icon: <User2Icon />,
    content: <AttendanceDeterminantsTab />,
  }
];
