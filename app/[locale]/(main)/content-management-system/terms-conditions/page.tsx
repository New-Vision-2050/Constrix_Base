import TermsConditionsView from "@/modules/content-management-system/terms-conditions";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import { fetchTermsConditions } from "./fetch-terms-conditions";

export default withServerPermissionsPage(
    async function TermsConditionsPage() {
        const data = await fetchTermsConditions();
        return <TermsConditionsView initialData={data} />
    },
    [PERMISSIONS.CMS.termsConditions.view]
);
