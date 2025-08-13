import React from "react";
import { SystemTab } from "@/modules/settings/types/SystemTab";
import { User2Icon } from "lucide-react";
import AttendanceDeterminantsTab from "../tabs/attendance-determinants";

// Tabs config for HR settings
// Default configuration with translation keys as comments
export const HRSettingsAttendanceDepartureTabsList: SystemTab[] = [
  {
    id: "attendance-determinants-tab",
    // Translation key: HRSettingsAttendanceDepartureModule.attendanceDeterminants.title
    title: "محددات الحضور", // Default value before translation
    icon: <User2Icon />,
    content: <AttendanceDeterminantsTab />,
  },
];

// Helper function to get translated tabs list
export const getTranslatedTabsList = (
  t: (key: string) => string
): SystemTab[] => {
  return [
    {
      id: "attendance-determinants-tab",
      title: t("attendanceDeterminants.title"),
      icon: <User2Icon />,
      content: <AttendanceDeterminantsTab />,
    },
  ];
};
