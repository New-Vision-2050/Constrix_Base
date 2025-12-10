import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import CompanyDashboardProjectsModule from "@/modules/content-management-system/projects";

function CompanyDashboardProjectsPage() {
    return <CompanyDashboardProjectsModule />
}

export default withServerPermissionsPage(CompanyDashboardProjectsPage, [
    Object.values(PERMISSIONS.CMS.projects),
    Object.values(PERMISSIONS.CMS.projectsTypes),
]);