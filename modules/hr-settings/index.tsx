"use client";

import React from "react";
import { HRSettingsProvider } from "./context/HRSettingsContext";
import HRSettingsTabs from "./components/HRSettingsTabs";
import HRStatisticsCards from "./components/StatisticsCards/HRStatisticsCards";

// The internal component that uses the context
function HRSettingsContent() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Statistics cards */}
      <HRStatisticsCards />
      
      {/* Tabs for HR settings navigation */}
      <HRSettingsTabs />
    </div>
  );
}

// Main exported component that provides the context
export default function HRSettings() {
  return (
    <HRSettingsProvider>
      <HRSettingsContent />
    </HRSettingsProvider>
  );
}
