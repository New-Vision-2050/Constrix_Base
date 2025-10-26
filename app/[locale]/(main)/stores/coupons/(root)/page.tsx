import CouponsView from "@/modules/stores/coupons/list/view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coupons",
  description: "Manage coupons, offers, and deals",
};

function ListCouponsPage() {
  return <CouponsView />;
}

export default ListCouponsPage;
