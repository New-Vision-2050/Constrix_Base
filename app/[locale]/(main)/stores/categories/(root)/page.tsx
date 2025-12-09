import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import CategoriesView from "@/modules/stores/categories/list/view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "List of categories",
};

function ListCategoriesPage() {
  return <CategoriesView />;
}

export default withServerPermissionsPage(ListCategoriesPage, [Object.values(PERMISSIONS.ecommerce.category)]);
