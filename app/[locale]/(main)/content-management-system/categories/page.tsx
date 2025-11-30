import CompanyDashboardCategoriesModule from "@/modules/content-management-system/categories";
import { fetchCategories } from "./fetch-categories";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";

async function CompanyDashboardCategoriesPage() {
    const categories = await fetchCategories();
    return <CompanyDashboardCategoriesModule categories={categories ?? []} />;
}

export default withServerPermissionsPage(CompanyDashboardCategoriesPage, [
    Object.values(PERMISSIONS.CMS.categories)
]);