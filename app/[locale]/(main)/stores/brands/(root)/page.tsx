import ListBrandsView from "@/modules/stores/brands/list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brands",
  description: "List of brands",
};

function ListBrandsPage() {
  return <ListBrandsView />;
}

export default ListBrandsPage;
