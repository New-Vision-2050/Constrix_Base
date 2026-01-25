
import CompanyDashboardBookStoreModule from "@/modules/content-management-system/BookStore";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";

async function CompanyDashboardBookStorePage() {
    return <CompanyDashboardBookStoreModule />;
}

export default withServerPermissionsPage(CompanyDashboardBookStorePage, [
    Object.values(PERMISSIONS.CMS.BookStore),
]);