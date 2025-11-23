import TermsConditionsView from "@/modules/content-management-system/terms-conditions";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";

export default withServerPermissionsPage(
    function TermsConditionsPage() {
        return <TermsConditionsView />
    },
    [PERMISSIONS.CMS.termsConditions.view]
);
