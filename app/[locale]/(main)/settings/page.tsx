"use client";

import { useSearchParams } from "next/navigation";
import TabsManager from "@/modules/settings/views/TabsManager";
import WorkPanelSettingsPage from "@/modules/work_panel_sidbar/components/WorkPanelSettingsPage";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const fromWorkPanel = searchParams.get("fromWorkPanel");
  
  if (fromWorkPanel) {
    return <WorkPanelSettingsPage />;
  }

  return (
    <div className="px-6">
      <div className="w-full flex items-center">
        <TabsManager />
      </div>
    </div>
  );
}
