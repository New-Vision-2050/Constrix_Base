import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import AddProductView from "@/modules/stores/products/add";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Product",
  description: "Add a new product to the store",
};

function AddProductPage() {
  return <AddProductView />;
}

export default withServerPermissionsPage(AddProductPage, [PERMISSIONS.ecommerce.product.create]);
