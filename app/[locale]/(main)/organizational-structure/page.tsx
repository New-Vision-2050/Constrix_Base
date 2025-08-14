import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import OrganizationalStructureMainView from "@/modules/organizational-structure";

export default withServerPermissionsPage(
  function OrganizationalStructurePage() {
    return <OrganizationalStructureMainView />;
  },
  [
    [
      PERMISSIONS.organization.branch.view,
      PERMISSIONS.organization.department.view,
      PERMISSIONS.organization.jobTitle.list,
      PERMISSIONS.organization.jobType.list,
      PERMISSIONS.organization.management.view,
      PERMISSIONS.organization.users.view,
    ],
  ]
);
