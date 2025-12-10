import TermsConditionsView from "@/modules/stores/terms/list/view";
import { Metadata } from "next";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Manage terms and conditions",
};

function TermsConditionsPage() {
  return <TermsConditionsView />;
}

export default withServerPermissionsPage(TermsConditionsPage, [Object.values(PERMISSIONS.ecommerce.page)]);
