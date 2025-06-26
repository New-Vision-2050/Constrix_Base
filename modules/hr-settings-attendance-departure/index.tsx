"use client";

import React from "react";
import { HRSettingsAttendanceDepartureProvider } from "./context/HRSettingsAttendanceDepartureContext";
import HRSettingsAttendanceDepartureTabs from "./components/HRSettingsAttendanceDepartureTabs";

// The internal component that uses the context
function HRSettingsAttendanceDepartureContent() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Tabs for HR Attendance & Departure settings navigation */}
      <HRSettingsAttendanceDepartureTabs />
    </div>
  );
}

/**
 * Main component for HR Attendance & Departure Settings module
 * Wraps content with context provider
 */
const HRSettingsAttendanceDeparture: React.FC = () => {
  return (
    <HRSettingsAttendanceDepartureProvider>
      <HRSettingsAttendanceDepartureContent />
    </HRSettingsAttendanceDepartureProvider>
  );
};

export default HRSettingsAttendanceDeparture;