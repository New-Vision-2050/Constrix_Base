import { PERMISSIONS } from "@/lib/permissions/permission-names";
import ListPaymentMethodsView from "@/modules/stores/payment-methods";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";

function PaymentMethodsPage() {
  return <ListPaymentMethodsView />;
}

export default withServerPermissionsPage(PaymentMethodsPage, [PERMISSIONS.ecommerce.paymentMethod.list]);