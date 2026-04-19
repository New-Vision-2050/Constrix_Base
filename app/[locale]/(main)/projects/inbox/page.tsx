import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import ProjectsInboxView from "@/modules/projects/inbox/views/ProjectsInboxView";

function ProjectsInboxPage() {
  return <ProjectsInboxView />;
}

export default withServerPermissionsPage(ProjectsInboxPage, [
  PERMISSIONS.projectManagement.list,
]);
