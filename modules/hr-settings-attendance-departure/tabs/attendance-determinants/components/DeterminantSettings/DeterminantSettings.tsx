"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Constraint } from "@/modules/hr-settings-attendance-departure/types/constraint-type";
import { SETTINGS_TABS } from "./config/settings-tabs";
import DeterminantDetailsTab from "./tabs/determinant-details";
import { TimingSettingsSection, AttendanceSettingsSection } from "./tabs/timing";
import { SelectedEmployees } from "./tabs/employees";
import { MapSettingsSection } from "./tabs/maps";
import { NotificationsSettingsSection } from "./tabs/notifications";

export default function DeterminantSettings({
  constraint,
}: {
  constraint: Constraint;
}) {
  return (
    <Tabs defaultValue="determinant-details" dir="rtl" className="w-full gap-4">
      <TabsList className="w-full h-auto gap-0 rounded-none border-0 border-b border-border bg-transparent p-0 justify-between overflow-x-auto">
        {SETTINGS_TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-none border-0 border-b-2 border-transparent bg-transparent px-3 py-3 text-sm font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none sm:px-4"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="determinant-details" className="pt-2">
        <DeterminantDetailsTab constraint={constraint} />
      </TabsContent>
      <TabsContent value="timing-settings" className="pt-2">
        <TimingSettingsSection />
        <AttendanceSettingsSection />
      </TabsContent>
      <TabsContent value="employees-settings" className="pt-2">
        <SelectedEmployees />
      </TabsContent>
      <TabsContent value="maps-settings" className="pt-2">
        <MapSettingsSection />
      </TabsContent>
      <TabsContent value="notifications-settings" className="pt-2">
        <NotificationsSettingsSection />
      </TabsContent>
    </Tabs>
  );
}
