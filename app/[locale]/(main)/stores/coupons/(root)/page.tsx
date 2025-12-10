import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import CouponsView from "@/modules/stores/coupons/list/view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coupons",
  description: "Manage coupons, offers, and deals",
};

function ListCouponsPage() {
  return <CouponsView />;
}

export default withServerPermissionsPage(ListCouponsPage, [
  PERMISSIONS.ecommerce.coupon.list,
  PERMISSIONS.ecommerce.featureDeal.list,
  PERMISSIONS.ecommerce.flashDeal.list,
  PERMISSIONS.ecommerce.dealDay.list
]);
