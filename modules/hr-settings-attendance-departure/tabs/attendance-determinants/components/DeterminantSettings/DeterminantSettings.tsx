"use client";

import { useTranslations } from "next-intl";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Constraint } from "@/modules/hr-settings-attendance-departure/types/constraint-type";
import { SETTINGS_TABS } from "./config/settings-tabs";
import DeterminantDetailsTab from "./tabs/determinant-details";
import { TimingSettingsSection, AttendanceSettingsSection } from "./tabs/shifts";
import { SelectedEmployees } from "./tabs/employees";
import { MapSettingsSection } from "./tabs/maps";
import { NotificationsSettingsSection } from "./tabs/notifications";

export default function DeterminantSettings({
  constraint,
}: {
  constraint: Constraint;
}) {
  const tTabs = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.determinantSettings.tabs",
  );
  const isRtl = useIsRtl();

  return (
    <Tabs
      defaultValue="determinant-details"
      dir={isRtl ? "rtl" : "ltr"}
      className="w-full gap-4"
    >
      <TabsList className="w-full h-auto gap-0 rounded-none border-0 border-b border-border bg-transparent p-0 justify-between overflow-x-auto">
        {SETTINGS_TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-none border-0 border-b-2 border-transparent bg-transparent px-3 py-3 text-sm font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none sm:px-4"
          >
            {tTabs(tab.labelKey)}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="determinant-details" className="pt-2">
        <DeterminantDetailsTab constraint={constraint} />
      </TabsContent>
      <TabsContent value="shifts" className="pt-2">
        <TimingSettingsSection constraintId={constraint.id} />
        <AttendanceSettingsSection constraintId={constraint.id} />
      </TabsContent>
      <TabsContent value="employees-settings" className="pt-2">
        <SelectedEmployees constraintId={constraint.id} />
      </TabsContent>
      <TabsContent value="maps-settings" className="pt-2">
        <MapSettingsSection constraintId={constraint.id} />
      </TabsContent>
      <TabsContent value="notifications-settings" className="pt-2">
        <NotificationsSettingsSection constraintId={constraint.id} />
      </TabsContent>
    </Tabs>
  );
}
