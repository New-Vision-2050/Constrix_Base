import CompanyDashboardCategoriesModule from "@/modules/content-management-system/categories";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";

async function CompanyDashboardCategoriesPage() {
  return <CompanyDashboardCategoriesModule />;
}

export default withServerPermissionsPage(CompanyDashboardCategoriesPage, [
  Object.values(PERMISSIONS.CMS.categories),
]);
