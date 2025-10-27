import ListProductsView from "@/modules/stores/products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "List of products",
};

function ListBrandsPage() {
  return <ListProductsView />;
}

export default ListBrandsPage;
