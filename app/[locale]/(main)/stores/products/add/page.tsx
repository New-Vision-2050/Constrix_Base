import AddProductView from "@/modules/stores/products/add";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Product",
  description: "Add a new product to the store",
};

function AddProductPage() {
  return <AddProductView />;
}

export default AddProductPage;
