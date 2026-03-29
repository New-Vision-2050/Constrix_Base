"use client";

import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import RootLevelTabs from "./tab-views/levels/root-level-tabs";

function ProjectsSettingsMainView() {
  return (
    <Can check={[PERMISSIONS.projectType.list]}>
      <div className="px-8 space-y-4">
        <RootLevelTabs />
      </div>
    </Can>
  );
}

export default ProjectsSettingsMainView;
