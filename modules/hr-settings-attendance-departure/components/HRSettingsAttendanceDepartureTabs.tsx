import React from "react";
import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { SystemTab } from "@/modules/settings/types/SystemTab";
import { getTranslatedTabsList } from "../config/tabs";
import { useTranslations } from "next-intl";

interface HRSettingsAttendanceDepartureTabsProps {
  onTabClick?: (tab: SystemTab) => void;
}

/**
 * Tabs component for HR Attendance & Departure settings navigation
 * Uses shared HorizontalTabs component with translations
 */
const HRSettingsAttendanceDepartureTabs: React.FC<
  HRSettingsAttendanceDepartureTabsProps
> = ({ onTabClick }) => {
  // Get translation function
  const t = useTranslations("HRSettingsAttendanceDepartureModule");
  
  // Use helper function to get translated tabs list
  const tabsWithTranslations = getTranslatedTabsList((key: string) => t(key));
  
  return (
    <HorizontalTabs
      list={tabsWithTranslations}
      onTabClick={onTabClick}
      bgStyleApproach
    />
  );
};

export default HRSettingsAttendanceDepartureTabs;
