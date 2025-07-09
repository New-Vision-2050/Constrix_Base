import React from "react";
import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { SystemTab } from "@/modules/settings/types/SystemTab";
import { HRSettingsAttendanceDepartureTabsList } from "../config/tabs";

interface HRSettingsAttendanceDepartureTabsProps {
  onTabClick?: (tab: SystemTab) => void;
}

/**
 * Tabs component for HR Attendance & Departure settings navigation using shared HorizontalTabs component
 */
const HRSettingsAttendanceDepartureTabs: React.FC<
  HRSettingsAttendanceDepartureTabsProps
> = ({ onTabClick }) => {
  return (
    <HorizontalTabs
      list={HRSettingsAttendanceDepartureTabsList}
      onTabClick={onTabClick}
      bgStyleApproach
    />
  );
};

export default HRSettingsAttendanceDepartureTabs;
