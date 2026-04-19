import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import ProjectsList from "@/modules/projects/project/views/list";

function ProjectsPage() {
  return <ProjectsList />;
}

export default withServerPermissionsPage(ProjectsPage, [
  PERMISSIONS.projectManagement.list,
]);
