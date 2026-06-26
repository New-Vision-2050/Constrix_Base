"use client";

import { useTranslations } from "next-intl";
import { ProceduresSettingsView } from "@/modules/hr-settings/tabs/procedures-settings";
import type { ProceduresSettingsOuterTab } from "@/modules/hr-settings/tabs/procedures-settings/types";

const TASK_DISTRIBUTION_OUTER_TABS: ProceduresSettingsOuterTab[] = [
  {
    id: 0,
    name: "maintenanceEmergencyTasks",
    type: "project_notification_task",
  },
];

export default function TaskDistributionSettingsPage() {
  const t = useTranslations("WorkPanel");

  return (
    <div className="px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("taskDistributionSettings")}</h1>
      </div>
      <ProceduresSettingsView
        outerTabs={TASK_DISTRIBUTION_OUTER_TABS}
        translationNamespace="hr-settings.proceduresSettings"
      />
    </div>
  );
}
