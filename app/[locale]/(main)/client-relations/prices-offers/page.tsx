"use client";

import PricesOffersIndex from "@/modules/crm-settings/components/prices-offers";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { withPermissionsPage } from "@/lib/permissions/client/withPermissionsPage";

const PricesOffersPage = () => {
  return <PricesOffersIndex />;
};

export default withPermissionsPage(PricesOffersPage, [
  PERMISSIONS.crm.pricesOffers.list,
]);
