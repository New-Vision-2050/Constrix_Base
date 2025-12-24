import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import ListProductsView from "@/modules/stores/products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "List of products",
};

function ListBrandsPage() {
  return <ListProductsView />;
}

export default withServerPermissionsPage(ListBrandsPage, [Object.values(PERMISSIONS.ecommerce.product)]);
