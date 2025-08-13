import React from "react";
import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { HRSettingsTabs as createHRSettingsTabs } from "../config/tabs";
import { useHRSettings } from "../context/HRSettingsContext";
import { SystemTab } from "@/modules/settings/types/SystemTab";
import { useTranslations } from "next-intl";

/**
 * Tabs component for HR settings navigation using shared HorizontalTabs component
 */
const HRSettingsTabs: React.FC = () => {
  const { setActiveTab } = useHRSettings();
  // Initialize translation for comments
  const t = useTranslations("hr-settings.tabs");
  
  // Create tabs with translations
  const tabsList = createHRSettingsTabs();

  // معالج النقر على التاب لتحديث الحالة النشطة في السياق
  const handleTabClick = (tab: SystemTab) => {
    setActiveTab(tab.id as any);
  };

  return (
    <HorizontalTabs 
      list={tabsList} 
      onTabClick={handleTabClick}
    />
  );
};

export default HRSettingsTabs;
