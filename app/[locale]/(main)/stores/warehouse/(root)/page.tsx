import ListWarehousesView from "@/modules/stores/warehouse/list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warehouses",
  description: "List of warehouses",
};

function ListWarehousesPage() {
  return <ListWarehousesView />;
}

export default ListWarehousesPage;
