import CompanyDashboardCategoriesModule from "@/modules/content-management-system/categories";
import { fetchCategories } from "./fetch-categories";

export default async function CompanyDashboardCategoriesPage() {
    const categories = await fetchCategories();
    return <CompanyDashboardCategoriesModule categories={categories ?? []} />;
}