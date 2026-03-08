import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import BrandsView from "@/modules/stores/brands";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brands",
  description: "List of brands",
};

function ListBrandsPage() {
  return <BrandsView />;
}

export default withServerPermissionsPage(ListBrandsPage, [Object.values(PERMISSIONS.ecommerce.brand)]);
