import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import ProjectsSettingsMainView from "@/modules/projects/settings/views/main-view";

function ProjectsSettingsPage() {
  return <ProjectsSettingsMainView />;
}

export default withServerPermissionsPage(ProjectsSettingsPage, [
  PERMISSIONS.projectType.list,
]);
