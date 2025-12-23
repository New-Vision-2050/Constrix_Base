import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import EditProductView from "@/modules/stores/products/edit";

function EditProductPage() {
  return <EditProductView />;
}

export default withServerPermissionsPage(EditProductPage, [PERMISSIONS.ecommerce.product.update]);