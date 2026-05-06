"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Constraint } from "@/modules/hr-settings-attendance-departure/types/constraint-type";
import EmployeeOptionsSection from "./components/EmployeeOptionsSection";
import TimingSettingsSection from "./components/TimingSettingsSection";
import { SETTINGS_TABS } from "./constants";

export default function DeterminantSettings({
  constraint,
}: {
  constraint: Constraint;
}) {
  return (
    <Tabs defaultValue="determinant-details" dir="rtl" className="w-full gap-4">
      <TabsList className="w-full h-auto p-1 bg-transparent border border-border rounded-xl justify-between overflow-x-auto">
        {SETTINGS_TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="determinant-details" className="pt-2">
        <h3 className="text-xl font-semibold">{constraint.constraint_name}</h3>
      </TabsContent>
      <TabsContent value="timing-settings" className="pt-2">
        <TimingSettingsSection />
        <EmployeeOptionsSection />
      </TabsContent>
      <TabsContent value="employees-settings" className="pt-2" />
      <TabsContent value="notifications-settings" />
    </Tabs>
  );
}
