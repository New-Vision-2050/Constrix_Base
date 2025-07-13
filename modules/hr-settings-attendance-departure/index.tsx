"use client";

import React from "react";
import { HRSettingsAttendanceDepartureProvider } from "./context/HRSettingsAttendanceDepartureContext";
import HRSettingsAttendanceDepartureTabs from "./components/HRSettingsAttendanceDepartureTabs";

function HRSettingsAttendanceDepartureContent() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <HRSettingsAttendanceDepartureTabs />
    </div>
  );
}

const HRSettingsAttendanceDeparture: React.FC = () => {
  return (
    <HRSettingsAttendanceDepartureProvider>
      <HRSettingsAttendanceDepartureContent />
    </HRSettingsAttendanceDepartureProvider>
  );
};

export default HRSettingsAttendanceDeparture;