import ListCategoriesView from "@/modules/stores/categories/list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "List of categories",
};

function ListCategoriesPage() {
  return <ListCategoriesView />;
}

export default ListCategoriesPage;
