import CategoriesView from "@/modules/stores/categories/list/view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "List of categories",
};

function ListCategoriesPage() {
  return <CategoriesView />;
}

export default ListCategoriesPage;
