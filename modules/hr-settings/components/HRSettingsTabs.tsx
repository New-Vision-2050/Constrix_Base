import React from "react";
import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { HRSettingsTabs as HRSettingsTabsList } from "../config/tabs";
import { useHRSettings } from "../context/HRSettingsContext";
import { SystemTab } from "@/modules/settings/types/SystemTab";

/**
 * Tabs component for HR settings navigation using shared HorizontalTabs component
 */
const HRSettingsTabs: React.FC = () => {
  const { setActiveTab } = useHRSettings();

  // معالج النقر على التاب لتحديث الحالة النشطة في السياق
  const handleTabClick = (tab: SystemTab) => {
    setActiveTab(tab.id as any);
  };

  return (
    <HorizontalTabs 
      list={HRSettingsTabsList} 
      onTabClick={handleTabClick}
    />
  );
};

export default HRSettingsTabs;
