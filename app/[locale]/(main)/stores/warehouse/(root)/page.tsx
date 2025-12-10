import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import ListWarehousesView from "@/modules/stores/warehouse/list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warehouses",
  description: "List of warehouses",
};

function ListWarehousesPage() {
  return <ListWarehousesView />;
}

export default withServerPermissionsPage(ListWarehousesPage, [Object.values(PERMISSIONS.ecommerce.warehouse)]);
