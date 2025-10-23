import BannersView from "@/modules/stores/banners/list/view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Banners",
  description: "List of banners",
};

function ListBannersPage() {
  return <BannersView />;
}

export default ListBannersPage;
