import BrandsView from "@/modules/stores/brands";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brands",
  description: "List of brands",
};

function ListBrandsPage() {
  return <BrandsView />;
}

export default ListBrandsPage;
