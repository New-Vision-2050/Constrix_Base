import TabsGroup from "@/components/shared/TabsGroup";
import { UsersSettingsTab } from "@/modules/program-settings/users-settings/components/Tabs";
import React from "react";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";

export default withServerPermissionsPage(
  function UsersSettingsPage() {
    return (
      <div className="px-8 space-y-7">
        <TabsGroup
          tabs={UsersSettingsTab}
          defaultValue="main"
          variant="primary"
          tabsListClassNames="justify-start gap-10"
        />
      </div>
    );
  },
  [Object.values(PERMISSIONS.subEntity)]
);
