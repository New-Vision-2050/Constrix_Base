import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import PricesOffersIndex from "./PeicesOffersView";

export default function PricesOffersView() {
    return (
        <Can check={[PERMISSIONS.crm.pricesOffers.list]}>
            <PricesOffersIndex />
        </Can>
    )
}